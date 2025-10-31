import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ API đang hoạt động!");
});

app.listen(8080, () => {
  console.log("🚀 Server chạy tại http://localhost:8080");
});
