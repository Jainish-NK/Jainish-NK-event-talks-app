import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: "dark", // default to dark initially

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    
    return { theme: nextTheme };
  }),

  initTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    
    set({ theme: initialTheme });
  }
}));

export default useThemeStore;
