document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  const logoutBtns = document.querySelectorAll(
    "#logout-btn, #logout-btn-desktop"
  );
  const loginBtns = document.querySelectorAll(".login-btn");

  // ---------- LOGIN STATE ----------
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));
  const isLoggedIn = session?.loggedIn;

  if (isLoggedIn) {
    logoutBtns.forEach((btn) => (btn.style.display = "inline-block"));
    loginBtns.forEach((btn) => (btn.style.display = "none"));
  } else {
    logoutBtns.forEach((btn) => (btn.style.display = "none"));
    loginBtns.forEach((btn) => (btn.style.display = "inline-block"));
  }

  // ---------- MENU TOGGLE ----------
  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("active-m");
  });

  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("active-m");
    }
  });

  // ---------- LOGOUT ----------
  logoutBtns.forEach((btn) => {
    btn?.addEventListener("click", () => {
      localStorage.removeItem("ticketapp_session");
      window.location.href = "/login";
    });
  });

  // ---------- ACTIVE LINK ----------
  const currentPath = window.location.pathname.split("/")[1]; // e.g. 'tickets'
  document.querySelectorAll(".nav-item").forEach((link) => {
    const linkPath = link.getAttribute("href").split("/")[1];
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
