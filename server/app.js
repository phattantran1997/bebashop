// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userToken = require("./routes/userTokenRoute")
const memberRoutes = require("./routes/memberRoutes");
const member_productRoutes = require("./routes/member_productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/token", userToken)
app.use("/api/members", memberRoutes);
app.use("/api/member-products", member_productRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
