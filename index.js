import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js'; // Assuming you have a Product model defined in routes/productRouter.js
import userRouter from './routes/userRouter.js'; // Assuming you have a Product model defined in routes/productRouter.js
import jwt from "jsonwebtoken";
const app = express();

const mongoUrl = "mongodb+srv://admin:123@cluster0.30a0apn.mongodb.net/test1?retryWrites=true&w=majority&appName=Cluster0"

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
            jwt.verify(token, "cbc-secret-key-7973", (error, decoded) => {
                if (!error) {
                    // console.log(decoded)
                    req.user = decoded
                } else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            })
        }
        next();
    }
)

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.listen(
    3000,
    () => {
        console.log('Server is running on http://localhost:3000');
    }
)