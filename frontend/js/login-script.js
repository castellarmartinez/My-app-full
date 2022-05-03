const base_url = "http://localhost:3000";

const form = document.getElementById('login_form');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let message = document.getElementById("message");
  message.textContent = "";

  let formData = new FormData(form);
  /* Convert data into json */
  let data = Object.fromEntries(formData);

  const url_login = `${base_url}/users/login`;

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
