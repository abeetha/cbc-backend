import express from 'express';
import { createProduct, getProduct, deleteProduct, getProductByName } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProduct);
productRouter.get('/byName', getProductByName);
productRouter.get("/filter", (req, res) => {
    res.json({
        message: "Filter endpoint is not implemented yet"
    });
});
productRouter.get('/:name', getProductByName);
productRouter.post('/', createProduct); 
productRouter.delete('/', deleteProduct);
productRouter.delete('/:name', deleteProduct);

export default productRouter;