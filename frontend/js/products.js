const host = "localhost:3000";

function getUser() {
  fetch(`http://${host}/products`)
    .then((response) => response.json())
    .then((products) => {
      const productInfoContainer = document.getElementById(
        "product-information"
      );
      
      let productInfo = '';

      products.products.forEach((product) => {      
         productInfo += `<p>Name: <strong>${product.name}</strong></p>`;
         productInfo += `<p>Price: <strong>${product.price}</strong></p>`;
         productInfo += `<p>ID: <strong>${product.ID}</strong></p>`;
         productInfo += `<hr>`;
      });

      productInfoContainer.innerHTML = productInfo;
    });
}

getUser();