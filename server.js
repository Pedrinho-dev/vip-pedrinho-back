const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;
const jwt = require('jsonwebtoken');


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

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
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
const User = mongoose.model('User', userSchema);

// Use Body Parser Middleware
app.use(express.json());
const jwtSecret = "xyz"

const authMiddleware = function (req, res, next){
    let token = req.headers.authorization;

    if(token){
        try {
            token =  token.split(' ')[1]

            jwt.verify(token,jwtSecret);
            next()
        }catch(error){
            res.status(401).json({error:"Invalid Token"});
        }
     } else  {  
        res.status(401).json({error:"Token not found"});
     }

}

app.post('/users/new',authMiddleware,   async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json({ error: 'User sucessfully saved ' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({username:req.body.username, password:req.body.password});
        if (user){
            const token = jwt.sign({username: user.username}, jwtSecret);
            res.json({token});
            res.status(200)
        }else {
            res.status(403).json({ error: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/users/token-validate', async (req, res) => {
    try {
        
        const token = req.body.token
        var decoded = jwt.verify(token, jwtSecret);
        console.log(decoded)
        res.send("Token Valid!")
        res.status(200)
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/users/user-validate', async (req, res) => {
    try {
        
        const token = req.body.token
        var decoded = jwt.verify(token, jwtSecret);
       
        const user = await User.findOne({username:decoded.username});
        if (user){
            res.send("User found!")
            res.status(200)
        }else {
            res.status(403).json({ error: 'User not found!' });
        }
       
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});



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
