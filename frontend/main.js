const API_URL = "http://localhost:5000/api/products";
let editingProductId = null;

function openModal(product = null) {
    document.getElementById("product-modal").style.display = "block";

    console.log(product)

    if (product) {
        document.getElementById("modal-title").innerText = "Update Product";
        document.getElementById("product-id").value = product.id;
        document.getElementById("product-title").value = product.title;
        document.getElementById("product-description").value = product.description;
        document.getElementById("product-category").value = product.category;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-imageUrl").value = product.imageUrl;
        editingProductId = product.id;
    } else {
        document.getElementById("modal-title").innerText = "Add Product";
        document.getElementById("product-id").value = "";
        document.getElementById("product-title").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("product-category").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-imageUrl").value = "";
        editingProductId = null;
    }
}

function closeModal() {
    document.getElementById("product-modal").style.display = "none";
}

function fetchProducts() {
    return fetch(API_URL)
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching products:", error);
            return [];
        });
}

function renderProducts() {
    const container = document.getElementById("product-container");
    container.innerHTML = "";

    fetchProducts().then(products => {
        products.forEach((product) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <button class="update" onclick='openModal(${JSON.stringify(product)})'>Update</button>
                <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
            `;

            container.appendChild(card);
        });
    });
}

function saveProduct() {
    const id = document.getElementById("product-id").value;
    const title = document.getElementById("product-title").value;
    const description = document.getElementById("product-description").value;
    const category = document.getElementById("product-category").value;
    const price = document.getElementById("product-price").value;
    const imageUrl = document.getElementById("product-imageUrl").value;

    const productData = { title, description, category, price, imageUrl };

    if (editingProductId) {
        fetch(`${API_URL}/update/${editingProductId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        })
        .then(response => response.json())
        .then(() => {
            closeModal();
            renderProducts();
        })
        .catch(error => console.error("Error updating product:", error));
    } else {
        fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        })
        .then(response => response.json())
        .then(() => {
            closeModal();
            renderProducts();
        })
        .catch(error => console.error("Error adding product:", error));
    }
}

function deleteProduct(id) {
    fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
    .then(response => {
        if (!response.ok) throw new Error(`Error deleting product: ${response.status}`);
        return response.status === 204 ? null : response.json();
    })
    .then(() => renderProducts())
    .catch(error => console.error("Error deleting product:", error));
}

renderProducts();
