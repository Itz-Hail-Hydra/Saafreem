const mobileNav = document.getElementById("nav-mobile");
const themeToggleButton = document.getElementById("theme-toggle");

function toggleMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.toggle("open");
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove("open");
}

window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;

function applyTheme(theme) {
  const body = document.body;
  const root = document.documentElement;
  if (theme === "dark") {
    body.classList.add("theme-dark");
    root.classList.add("theme-dark");
  } else {
    body.classList.remove("theme-dark");
    root.classList.remove("theme-dark");
  }
}

function getPreferredTheme() {
  const stored = window.localStorage.getItem("sap-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function setTheme(theme) {
  applyTheme(theme);
  window.localStorage.setItem("sap-theme", theme);
}

// Always start from the top on reload/visit
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Initialize theme and interactions once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const isDark = document.body.classList.contains("theme-dark");
      setTheme(isDark ? "light" : "dark");
    });
  }

  // Animate sections on scroll
  const animatedSections = document.querySelectorAll(".section-animate");
  if (animatedSections.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.25 }
    );

    animatedSections.forEach((section) => observer.observe(section));
  } else {
    // Fallback: show all sections if IntersectionObserver is not supported
    animatedSections.forEach((section) => section.classList.add("in-view"));
  }

  // Navbar shadow on scroll
  const navbar = document.querySelector(".navbar");
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 10) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  // Ensure "Home" links scroll to the very top of the page
  const homeLinks = document.querySelectorAll('a[href="#home"]');
  homeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMobileNav();
    });
  });
});
