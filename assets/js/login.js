document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const errorEmail = document.getElementById("error-email");
  const errorPassword = document.getElementById("error-password");
  const errorGeneral = document.getElementById("error-general");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form submission!

    // Clear previous errors
    errorEmail.textContent = "";
    errorPassword.textContent = "";
    errorGeneral.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let hasError = false;

    if (!email) {
      errorEmail.textContent = "Email is required";
      hasError = true;
    }
    if (!password) {
      errorPassword.textContent = "Password is required";
      hasError = true;
    }
    if (hasError) return;

    const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      errorGeneral.textContent = "Invalid email or password";
      return;
    }

    localStorage.setItem(
      "ticketapp_session",
      JSON.stringify({ user, loggedIn: true })
    );

    // Redirect
    window.location.href = "/dashboard";
  });
});
