const base_url = "http://localhost:3000";

const form = document.getElementById('signup_form');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let message = document.getElementById("message");
  message.textContent = "";

  let formData = new FormData(form);
  /* Convert data into json */
  let data = Object.fromEntries(formData);
  data.phone = 3001112222; // Adds number temporally, remove after the database schema is modified

  const url_login = `${base_url}/users/register`;

  fetch(url_login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      form.reset();
      message.textContent = (data.error ? data.error : data.message)
    })
});
