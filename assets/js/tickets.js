// ✅ TICKET MANAGER JS - Updated for CSS

console.log("Tickets JS loaded");

(function () {
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));
  const userEmail = session?.user?.email;

  if (!userEmail) {
    window.location.href = "/login";
    return;
  }

  const ticketsKey = `ticketapp_tickets_${userEmail}`;
  let tickets = JSON.parse(localStorage.getItem(ticketsKey)) || [];
  let editingTicket = null;

  const ticketManager = document.getElementById("ticket-manager");
  const ticketListContainer = document.getElementById("ticket-list-container");
  const ticketFormContainer = document.getElementById("ticket-form-container");
  const confirmModalContainer = document.getElementById(
    "confirm-modal-container"
  );
  const filtersContainer = document.getElementById("ticket-filters-container");
  const addBtn = document.getElementById("add-ticket-btn");

  const statusColors = {
    open: "green",
    in_progress: "orange",
    closed: "gray",
  };

  function saveTickets() {
    localStorage.setItem(ticketsKey, JSON.stringify(tickets));
  }

  // ------------------- FORM -------------------
  function showForm(ticket = null) {
    editingTicket = ticket;
    ticketFormContainer.style.display = "flex";
    ticketListContainer.style.display = "none";
    filtersContainer.style.display = "none";

    ticketFormContainer.innerHTML = `
      <form id="ticket-form" class="ticket-form">
        <h2>${ticket?.id ? "Edit Ticket" : "Create Ticket"}</h2>
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="name" class="input" value="${ticket?.name || ""}" />
          <p class="error-msg" style="display:none;"></p>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" class="input desc">${ticket?.description || ""}</textarea>
          <p class="error-msg" style="display:none;"></p>
        </div>
        <div class="form-group">
          <label>Priority</label>
          <select name="priority" class="input">
            <option ${ticket?.priority === "Low" ? "selected" : ""}>Low</option>
            <option ${ticket?.priority === "Medium" ? "selected" : ""}>Medium</option>
            <option ${ticket?.priority === "High" ? "selected" : ""}>High</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status" class="input">
            <option value="open" ${ticket?.status === "open" ? "selected" : ""}>Open</option>
            <option value="in_progress" ${ticket?.status === "in_progress" ? "selected" : ""}>In Progress</option>
            <option value="closed" ${ticket?.status === "closed" ? "selected" : ""}>Closed</option>
          </select>
        </div>
        <div class="form-group">
          <label>Due Date</label>
          <input type="date" name="dueDate" class="input date" value="${ticket?.dueDate || ""}" />
          <p class="error-msg" style="display:none;"></p>
        </div>
        <div class="actions">
          <button type="submit" class="save-btn">Save</button>
          <button type="button" id="cancel-btn" class="cancel">Cancel</button>
        </div>
      </form>
    `;

    const form = document.getElementById("ticket-form");
    const cancelBtn = document.getElementById("cancel-btn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());

      let errors = {};
      if (!formData.name.trim()) errors.name = "Title is required";
      if (!formData.description.trim())
        errors.description = "Description is required";
      if (!formData.dueDate) errors.dueDate = "Due date is required";

      // show errors
      form
        .querySelectorAll(".error-msg")
        .forEach((p) => (p.style.display = "none"));
      Object.keys(errors).forEach((key) => {
        const p = form.querySelector(`[name="${key}"]`).nextElementSibling;
        p.innerText = errors[key];
        p.style.display = "block";
      });

      if (Object.keys(errors).length) return;

      // save ticket
      if (editingTicket?.id) {
        tickets = tickets.map((t) =>
          t.id === editingTicket.id ? { ...editingTicket, ...formData } : t
        );
      } else {
        tickets.push({
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
        });
      }

      saveTickets();
      hideForm();
      renderTickets();
    });

    cancelBtn.addEventListener("click", hideForm);
  }

  function hideForm() {
    ticketFormContainer.style.display = "none";
    ticketListContainer.style.display = "flex";
    filtersContainer.style.display = "flex";
    editingTicket = null;
  }

  // ------------------- MODAL -------------------
  function showModal(message, onConfirm) {
    confirmModalContainer.innerHTML = `
      <div class="confirm-overlay">
        <div class="confirm-modal">
          <p>${message}</p>
          <div class="modal-actions">
            <button class="confirm-btn">Yes</button>
            <button class="cancel-btn">No</button>
          </div>
        </div>
      </div>
    `;
    const confirmBtn = confirmModalContainer.querySelector(".confirm-btn");
    const cancelBtn = confirmModalContainer.querySelector(".cancel-btn");

    confirmBtn.addEventListener("click", () => {
      onConfirm();
      confirmModalContainer.innerHTML = "";
    });
    cancelBtn.addEventListener(
      "click",
      () => (confirmModalContainer.innerHTML = "")
    );
  }

  // ------------------- LIST -------------------
  function renderTickets() {
    if (!tickets.length) {
      ticketListContainer.innerHTML =
        "<p class='no-tickets'>No tickets found</p>";
      return;
    }

    const searchValue =
      document.getElementById("search-input")?.value.toLowerCase() || "";
    const priorityValue =
      document.getElementById("priority-filter")?.value || "All";
    const statusValue =
      document.getElementById("status-filter")?.value || "All";

    let filtered = tickets.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(searchValue);
      const matchPriority =
        priorityValue === "All" || t.priority === priorityValue;
      const matchStatus = statusValue === "All" || t.status === statusValue;
      return matchSearch && matchPriority && matchStatus;
    });

    ticketListContainer.innerHTML = filtered
      .map(
        (t) => `
      <div class="ticket-card" data-id="${t.id}">
        <div class="ticket-card-header">
          <h3>${t.name}</h3>
          <div class="tags">
            <p class="priority ${t.priority.toLowerCase()}">${t.priority}</p>
            <span class="status" style="background-color:${
              statusColors[t.status]
            }">${t.status}</span>
          </div>
        </div>
        <p class="desc">${t.description}</p>
        <div class="ticket-bottom"><strong>Due:</strong> ${t.dueDate}</div>
        <div class="actions">
          <button class="edit-btn">edit</button>
          <button class="delete-btn del">delete</button>
        </div>
      </div>
    `
      )
      .join("");

    // add event listeners
    ticketListContainer.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.closest(".ticket-card").dataset.id);
        const ticket = tickets.find((t) => t.id === id);
        showForm(ticket);
      });
    });

    ticketListContainer.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.closest(".ticket-card").dataset.id);
        showModal("Are you sure you want to delete this ticket?", () => {
          tickets = tickets.filter((t) => t.id !== id);
          saveTickets();
          renderTickets();
        });
      });
    });
  }

  // ------------------- FILTERS -------------------
  filtersContainer.innerHTML = `
    <input type="text" id="search-input" placeholder="Search by name..." class="input"/>
    <select id="priority-filter" class="input">
      <option>All</option>
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>
    <select id="status-filter" class="input">
      <option>All</option>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="closed">Closed</option>
    </select>
  `;

  ["search-input", "priority-filter", "status-filter"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderTickets);
  });

  addBtn.addEventListener("click", () => showForm());

  renderTickets();
})();
    