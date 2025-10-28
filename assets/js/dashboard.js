document.addEventListener("DOMContentLoaded", () => {
  // Load session
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));
  if (!session?.loggedIn) {
    window.location.href = "/login";
    return;
  }

  const user = session.user;
  const userName = user.name || "User";
  document.getElementById("welcome-user").textContent = `Welcome, ${userName}!`;

  // Load tickets
  const tickets =
    JSON.parse(localStorage.getItem(`ticketapp_tickets_${user.email}`)) || [];

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    closed: tickets.filter(t => t.status === "closed").length
  };

  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-open").textContent = stats.open;
  document.getElementById("stat-in-progress").textContent = stats.inProgress;
  document.getElementById("stat-closed").textContent = stats.closed;

  // Logout button
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("ticketapp_session");
    window.location.href = "/login";
  });

  // Tickets navigation
  const goToTickets = (status) => {
    // store filter in sessionStorage for tickets page
    sessionStorage.setItem("ticket_filter", status);
    window.location.href = "/tickets";
  };

  document.getElementById("btn-tickets").addEventListener("click", () => goToTickets("all"));

  document.querySelectorAll(".stat-card").forEach(card => {
    card.addEventListener("click", () => {
      const status = card.dataset.status;
      goToTickets(status);
    });
  });
});
