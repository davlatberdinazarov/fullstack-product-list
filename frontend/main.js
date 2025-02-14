// VARIABLES
const row = document.querySelector(".row");
let modalTitle = document.querySelector(".modal-title");

// api url
let API_URL = "http://localhost:5000/api/products";

// FETCH DATA
function fetchAllProducts() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);
    })

    .catch((err) => console.log(err));
}

function displayProducts(data) {
  data.forEach((product) => {
    let card = document.createElement("div");
    card.className = "card col-sm-4";
    card.style.width = "400px";

    let productStringfy = JSON.stringify(product);

    card.innerHTML = `
            <img
            class="card-img-top"
            src="${product?.imageUrl}"
            alt="Card image"
          />
          <div class="card-body">
            <h4 class="card-title">${product?.title}</h4>
            <p class="card-text">${product?.description}</p>
            <h4 class="card-text">${product?.category}</h4>
            <div class="btn-group btn-group-lg">
                <button type="button" class="btn btn-warning btn-update" 
                    data-bs-toggle="modal" 
                    data-bs-target="#updateModal"
                    data-id="${product.id}" 
                    data-title="${product.title}" 
                    data-description="${product.description}" 
                    data-category="${product.category}" 
                    data-price="${product.price}" 
                    data-imageUrl="${product.imageUrl}">
                        Update
                </button>              
                <button type="button" class="btn btn-danger btn-delete">Delete</button>
            </div>
          </div>
        `;

    let updateBtn = card.querySelector(".btn-update");
    updateBtn.addEventListener("click", (event) => {
      let btn = event.target;
      let productData = {
        id: btn.getAttribute("data-id"),
        title: btn.getAttribute("data-title"),
        description: btn.getAttribute("data-description"),
        category: btn.getAttribute("data-category"),
        price: btn.getAttribute("data-price"),
        imageUrl: btn.getAttribute("data-imageUrl"),
      };
      updateProduct(productData);
    });

    let deleteBtn = card.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => {
      deleteProduct(product.id);
    });

    row.appendChild(card);
  });
}

function createProduct() {
  let productTitle = document.getElementById("title").value;
  let productDescription = document.getElementById("description").value;
  let productCategory = document.getElementById("category").value;
  let productPrice = document.getElementById("price").value;
  let productImageUrl = document.getElementById("imageUrl").value;

  let options = {
    id: Date.now().toString(),
    title: productTitle,
    description: productDescription,
    category: productCategory,
    price: parseFloat(productPrice),
    imageUrl: productImageUrl,
  };

  fetch(API_URL + `/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  })
    .then((response) => response.json())
    .then(() => {
      row.innerHTML = "";
      fetchAllProducts();
    })

    .catch((error) => console.error("Error creating product:", error));
}

function updateProduct(product) {
  if (!product) {
    console.error("Mahsulot ma'lumotlari yo'q!");
    return;
  }

  console.log("Updating product:", product);

  document.getElementById("title-update").value = product.title || "";
  document.getElementById("description-update").value =
    product.description || "";
  document.getElementById("category-update").value = product.category || "";
  document.getElementById("price-update").value = product.price || "";
  document.getElementById("imageUrl-update").value = product.imageUrl || "";

  // Mahsulot ID sini formga saqlash uchun qo'shamiz
  document.getElementById("update-product-id").value = product.id;
}

function updateAndSaveProduct() {
  let productId = document.getElementById("update-product-id").value;
  let productTitle = document.getElementById("title-update").value;
  let productDescription = document.getElementById("description-update").value;
  let productCategory = document.getElementById("category-update").value;
  let productPrice = document.getElementById("price-update").value;
  let productImageUrl = document.getElementById("imageUrl-update").value;

  let updatedProduct = {
    title: productTitle,
    description: productDescription,
    category: productCategory,
    price: parseFloat(productPrice),
    imageUrl: productImageUrl,
  };

  fetch(API_URL + `/update/` + productId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Error updating product: ${response.status}`);
      return response.json();
    })
    .then(() => {
      row.innerHTML = "";
      fetchAllProducts();
    })
    .catch((error) => console.error("Error updating product:", error));
}

function deleteProduct(productId) {
  fetch(API_URL + "/delete/" + productId, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Error deleting product: ${response.status}`);
      return response.status === 204 ? null : response.json();
    })
    .then(() => {
      row.innerHTML = "";
      fetchAllProducts();
    })
    .catch((error) => console.error("Error deleting product:", error));
}

fetchAllProducts();
