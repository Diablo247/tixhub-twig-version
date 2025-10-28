document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const errorName = document.getElementById("error-name");
  const errorEmail = document.getElementById("error-email");
  const errorPassword = document.getElementById("error-password");
  const successMsg = document.getElementById("success-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous messages
    errorName.textContent = "";
    errorEmail.textContent = "";
    errorPassword.textContent = "";
    successMsg.textContent = "";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let hasError = false;

    // Validation
    if (!name) {
      errorName.textContent = "Name is required.";
      hasError = true;
    }
    if (!email) {
      errorEmail.textContent = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorEmail.textContent = "Enter a valid email address.";
      hasError = true;
    }
    if (!password) {
      errorPassword.textContent = "Password is required.";
      hasError = true;
    } else if (password.length < 5) {
      errorPassword.textContent = "Password must be at least 5 characters.";
      hasError = true;
    }

    if (hasError) return;

    // Check existing users in localStorage
    const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      errorEmail.textContent = "Email is already registered.";
      return;
    }

    // Save new user
    users.push({ name, email, password });
    localStorage.setItem("ticketapp_users", JSON.stringify(users));

    successMsg.textContent = "Account created successfully! Redirecting to login...";
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  });
});
