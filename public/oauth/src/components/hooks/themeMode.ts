export const useThemeMode = () => {
  const Query = new URLSearchParams(window.location.search);

  switch (Query.get("theme")) {
    case "dark":
      return "dark";

    case "light":
      return "light";

    case "system":
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    default:
      return "light";
  }
};
