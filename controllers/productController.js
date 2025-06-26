import Product from '../models/product.js';
import { isAdmin } from './userController.js'; // Assuming you have an auth utility to check admin status

export function createProduct(req, res) {

    if (!isAdmin(req)) {
        // return res.status(403).json({ message: 'Please login as administrator to create products' });
        res.json({
            message: "Please login as administrator to add products"
        })
        return
    }
    const newProductData = req.body;
    const product = new Product(newProductData);
    product.save()
        .then(() => {
            res.json({ message: 'Product created successfully' });
        })
        .catch((error) => {
            res.status(403).json({ message: 'Error creating product', error });
        });
}

export function getProducts(req, res) {
    Product.find({})
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Error fetching products', error });
        });
}

export function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to delete products"
        })
        return
    }
    const productId = req.params.productId
    Product.deleteOne(
        { productId: productId }
    ).then(() => {
        res.json({
            message: "Product deleted successfully"
        })
    }).catch((error) => {
        res.status(403).json({
            message: error
        })
    })
}

