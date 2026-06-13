import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mini CRM API Running");
});

// Routes
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});