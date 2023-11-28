const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors())
app.use(express.json())
// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
try {
    mongoose.connect('mongodb+srv://pedroantoniofalves:sj3QT2ML2dHyvDar@cluster0.zxm87x3.mongodb.net/dbecommerce?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error)
}

// Define Product Schema
const productSchema = new mongoose.Schema({
    desc: String,
    price: String,
    img: String,
    id: Number,
});

// Define Order Schema
const orderSchema = new mongoose.Schema({
    products: [productSchema],
    total: Number,
    createAt: String,
});

// Create Product and Order Models
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Use Body Parser Middleware
app.use(express.json());

// Define a GET endpoint for /products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a GET endpoint for /orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const order = new Order(req.body.order)
        await order.save()
        res.status(201)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
