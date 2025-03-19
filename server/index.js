import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js'

const app = express();

// Middleware configurations
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'https://binkeyit-shop.vercel.app' ,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined')); // Specify the format explicitly
// app.use(helmet({
//     crossOriginResourcePolicy: false, // Allow cross-origin resources
// }));

// Set the port
const PORT = process.env.PORT || 4000; // Corrected order

// Root route
app.get("/", (req, res) => {
    res.json({
        message: `Server is running on port ${PORT}`, // Adjusted message formatting
    });
});

app.use('/api/user',userRouter)
app.use('/api/category/',categoryRouter)
app.use('/api/file',uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)


// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit if the DB connection fails
});
