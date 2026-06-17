import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# URL of the BigQuery Release Notes feed
FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"
NAMESPACES = {"atom": "http://www.w3.org/2005/Atom"}


def parse_rfc3339(date_str):
    """Parse RFC 3339 date strings (e.g., '2026-06-16T00:00:00-07:00') into a friendly format."""
    try:
        # Strip timezone offset for simple parsing if it ends with -XX:XX or +XX:XX
        clean_date = re.sub(r"[-+]\d{2}:\d{2}$", "", date_str)
        dt = datetime.strptime(clean_date, "%Y-%m-%dT%H:%M:%S")
        return dt.strftime("%b %d, %Y")
    except Exception:
        return date_str


def extract_categories(html_content):
    """Extract update categories (e.g., Announcement, Feature, Fix) from release note content."""
    # Find all content inside <h3> tags in the HTML snippet
    categories = re.findall(r"<h3>(.*?)</h3>", html_content)
    # Strip any HTML tags or extra spaces that might be inside <h3>
    cleaned_categories = []
    for cat in categories:
        clean = re.sub(r"<[^>]+>", "", cat).strip()
        if clean and clean not in cleaned_categories:
            cleaned_categories.append(clean)
    return cleaned_categories


def fetch_and_parse_feed():
    """Fetches the XML feed and parses it into structured JSON-compatible data."""
    try:
        req = urllib.request.Request(
            FEED_URL,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)

        # Get feed level metadata
        feed_title = root.find("atom:title", NAMESPACES)
        feed_title = feed_title.text if feed_title is not None else "BigQuery Release Notes"

        feed_updated = root.find("atom:updated", NAMESPACES)
        feed_updated = (
            parse_rfc3339(feed_updated.text)
            if feed_updated is not None
            else "Unknown"
        )

        entries = []
        stats = {
            "total_updates": 0,
            "announcements": 0,
            "features": 0,
            "fixes": 0,
            "deprecations": 0,
            "others": 0,
        }

        for entry_el in root.findall("atom:entry", NAMESPACES):
            title_el = entry_el.find("atom:title", NAMESPACES)
            title = title_el.text if title_el is not None else "Untitled"

            id_el = entry_el.find("atom:id", NAMESPACES)
            entry_id = id_el.text if id_el is not None else ""

            updated_el = entry_el.find("atom:updated", NAMESPACES)
            updated = (
                parse_rfc3339(updated_el.text)
                if updated_el is not None
                else "Unknown"
            )

            link_el = entry_el.find("atom:link[@rel='alternate']", NAMESPACES)
            if link_el is None:
                link_el = entry_el.find("atom:link", NAMESPACES)
            link = link_el.attrib.get("href", "") if link_el is not None else ""

            content_el = entry_el.find("atom:content", NAMESPACES)
            content_html = content_el.text if content_el is not None else ""

            # Extract categories from the HTML content
            categories = extract_categories(content_html)

            # Update stats based on categories
            stats["total_updates"] += 1
            if not categories:
                stats["others"] += 1
            else:
                for cat in categories:
                    cat_lower = cat.lower()
                    if "announcement" in cat_lower:
                        stats["announcements"] += 1
                    elif "feature" in cat_lower:
                        stats["features"] += 1
                    elif "fix" in cat_lower or "bug" in cat_lower:
                        stats["fixes"] += 1
                    elif "deprecation" in cat_lower or "deprecated" in cat_lower:
                        stats["deprecations"] += 1
                    else:
                        stats["others"] += 1

            entries.append(
                {
                    "id": entry_id,
                    "title": title,
                    "updated": updated,
                    "link": link,
                    "content": content_html,
                    "categories": categories,
                }
            )

        return {
            "success": True,
            "title": feed_title,
            "updated": feed_updated,
            "entries": entries,
            "stats": stats,
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.route("/")
def home():
    """Render the main release notes interface."""
    return render_template("index.html")


@app.route("/api/release-notes")
def release_notes_api():
    """API endpoint returning the structured release notes data."""
    data = fetch_and_parse_feed()
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
