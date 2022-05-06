const backendURL = "http://localhost:3000";

const mercadopagoButton = document.getElementById("mercadopagoButton");
mercadopagoButton.addEventListener("click", (e) => {
  e.preventDefault();

  const paymentURL = `${backendURL}/mercadopago/pago`;
  const MERCADOPAGO_PUBLIC_KEY = "APP_USR-f8da28b6-a90d-431e-ba0c-79b0cfbef506";

  const data = { amount: 1234 };

  fetch(paymentURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const preferenceId = data.preferenceId;
      const url = data.url;
      const redirect = true;

      if (redirect) {
        console.log(`Redireccionar a la url: ${url}`);
        window.location.href = url;
      } else {
        const mp = new MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
          locale: "es-AR",
        });

        mp.checkout({
          preference: {
            id: preferenceId,
          },
          render: {
            container: ".cho-container",
            label: "Pagar",
          },
        });
      }
    });
})

const paypalButton = document.getElementById("paypalButton");
paypalButton.addEventListener("click", get_preference_paypal);

function get_preference_paypal(e) {
  // paso 1. Preparar el pago (ir al backend y obtener un preference_id)
  // paso 2. Crear un botón que abre la ventana de MercadoPago.
  e.preventDefault();
  console.log("click");

  const paymentURL = `${backendURL}/paypal/pago`;

  const data = { amount: 1234 };

  fetch(paymentURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //debugger
      const url = data.href;
      window.location.href = url;
    });
}
