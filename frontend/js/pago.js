const base_url = "http://localhost:3000";

var payment_btn = document.getElementById("mercadopago_btn");
payment_btn.addEventListener("click", get_preference_id);

function get_preference_id(e) {
  // paso 1. Preparar el pago (ir al backend y obtener un preference_id)
  // paso 2. Crear un botón que abre la ventana de MercadoPago.
  e.preventDefault();
  console.log("click");

  const payment_url = `${base_url}/mercadopago/pago`;
  let MERCADOPAGO_PUBLIC_KEY = "APP_USR-f8da28b6-a90d-431e-ba0c-79b0cfbef506";

  const data = { amount: 1234 };

  fetch(payment_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const preference_id = data.preference_id;
      const url = data.url;
      const redirect = true; // change this to have different views

      if (redirect) {
        // use the URL if you want to redirect
        console.log(`Redireccionar a la url: ${url}`);
        window.location.href = url;
      } else {
        // Use preference_id to show a modal
        const mp = new MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
          locale: "es-AR",
        });

        // Inicializa el checkout
        mp.checkout({
          preference: {
            id: preference_id,
          },
          render: {
            container: ".cho-container", // Indica el nombre de la clase donde se mostrará el botón de pago
            label: "Pagar", // Cambia el texto del botón de pago (opcional)
          },
        });
      }
    });
}

// var payment_btn2 = document.getElementById("paypal_btn");
// payment_btn2.addEventListener("click", get_preference_paypal);

function get_preference_paypal(e) {
  // paso 1. Preparar el pago (ir al backend y obtener un preference_id)
  // paso 2. Crear un botón que abre la ventana de MercadoPago.
  e.preventDefault();
  console.log("click");

  const payment_url = `${base_url}/paypal/pago`;

  const data = { amount: 1234 };

  fetch(payment_url, {
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
