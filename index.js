const express = require('express');
const app = express();
const products = require('./db');
const cors = require('cors');
// Define the API endpoints
app.use(express.json());

// Enable CORS
app.use(cors());

// Endpoint to get all products

app.get('/api/products', (req, res) => {
    res.json(products).status(200);
});

// by id

app.get('/api/products/:id', (req, res) => {
    let id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product).status(200);
});

// create

app.post('/api/products/create', (req, res) => {
    const product = req.body;
    console.log(product);
    const newProduct = {
        id: products.length + 1,
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        imageUrl: req.body.imageUrl,
    }
    console.log(newProduct);
    products.push(newProduct);
    res.json(newProduct).status(201);
});

// update

app.put('/api/products/update/:id', (req, res) => {
    let id = parseInt(req.params.id);

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = {
        id,
       ...req.body,
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct).status(200);
});

// delete

app.delete('/api/products/delete/:id', (req, res) => {
    let id = parseInt(req.params.id);

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: 'Product deleted successfully' }); // ✅ JSON javob qaytarish
});

// Endpoint to get a single product by ID



const PORT = 5000;

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
})