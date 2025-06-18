import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
 // Assuming you have a Product model defined in routes/productRouter.js
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_DB_URI

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection

connection.once("open", () => {
    console.log('MongoDB connection established successfully');
});
app.use(bodyParser.json())
app.use(
    (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token)
       
        if (token != null) {
            // jwt.verify(token, "cbc-secret-key-7973", (error, decoded) => {
            jwt.verify(token,process.env.SECRET, (error, decoded) => {
                if (!error) {
                    req.user = decoded
                    console.log(decoded)
                } else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            })
        }
        next();
    }
)

app.use("/api/users", userRouter);
app.use("/api/products",productRouter )
app.use("/api/orders",orderRouter )

app.listen(
    3000,
    () => {
        console.log('Server is running on http://localhost:3000');
    }
)