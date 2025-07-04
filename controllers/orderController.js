import Order from '../models/order.js';
import { isCustomer } from './userController.js';
import Product from '../models/product.js';

export async function createOrder(req, res) {
    if (!isCustomer) {
        res.json({
            message: "Please login as a customer to create orders"
        })
        return
    }
    try {
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1)
        // const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1)

        let orderId
        if (latestOrder.length == 0) {
            orderId = "CBC0001"
        } else {
            const currentOrderId = latestOrder[0].orderId
            const numberString = currentOrderId.replace("CBC", "")
            const number = parseInt(numberString)

            const newNumber = (number + 1).toString().padStart(4, "0")
            orderId = "CBC" + newNumber;
        }
        const newOrderData = req.body
        const newProductArray = []

        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            console.log(req.body.orderedItems[i])
            const product = await Product.findOne({ productId: newOrderData.orderedItems[i].productId })
            if (product == null) {
                res.json({
                    message: "Product with id " + newOrderData.orderedItems[i].productId + " not found"
                })
                return
            }
            newProductArray[i] = {
                name: product.productName,
                price: product.lastPrice,
                quantity: newOrderData.orderedItems[i].qty,
                image: product.images[0],
            }
        }
        console.log(newProductArray)

        newOrderData.orderedItems = newProductArray

        newOrderData.orderId = orderId
        newOrderData.email = req.user.email
        const order = new Order(newOrderData)
        const savedOrder = await order.save();

        await order.save()
        res.json({
            message: "Order created successfully",
            order: savedOrder
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export async function getOrders(req, res) {
    try {
        if (isCustomer(req)) {
            const orders = await Order.find({ email: req.user.email })
            res.json(orders)
            return;
        } else if (isAdmin(req)) {
            const orders = await Order.find({});
            res.json(orders);
            return;
        } else {
            res.json({
                message: "Please login to view orders"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export async function getQuote(req, res) {
    try {
        const newOrderData = req.body
        const newProductArray = []
        let total = 0;
        let labeledTotal = 0;
        console.log("test1", req.body)
        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            console.log("test2", req.body.orderedItems[i])
            const product = await Product.findOne({ productId: newOrderData.orderedItems[i].productId })
            if (product == null) {
                res.json({
                    message: "Product with id " + newOrderData.orderedItems[i].productId + " not found"
                });
                return;
            }
            labeledTotal += product.price * newOrderData.orderedItems[i].qty;
            total += product.lastPrice * newOrderData.orderedItems[i].qty;
            newProductArray[i] = {
                name: product.productName,
                price: product.lastPrice,
                labeledPrice: product.price,
                quantity: newOrderData.orderedItems[i].qty,
                image: product.images[0],
            };
        }
        newOrderData.orderedItems = newProductArray
        newOrderData.total = total;
        res.json({
            orderedItems: newProductArray,
            total: total,
            labeledTotal: labeledTotal
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}