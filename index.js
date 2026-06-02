import "dotenv/config";
import db from "./db/db.config.js";

// const { Pool } = pg;
import express from "express";
// import db from "./db/db.config.js";
import fs from "fs/promises";
import mainrouter from "./src/api/main.routes.js";
import { errorHandler } from "./src/middleware/error-Handler.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "https://your-frontend-domain.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use("/api", mainrouter);

// // req -> middleware -> res

// app.get('/', (req, res) => {
//     console.log(req);
//     res.send('Hello World!');
// });

// app.get('/about', (req, res) => {
//     res.send('Hello World! from about route');
// });

// app.get('/api/chat', (req, res) => {
//     res.send('Hello World! from chat route');
// });

// app.get('/api/conversation', (req, res) => {
//     res.send('Hello World! from conversation route');
// });

app.get("/", (req, res) => {
  res.send("Hello homepage!");
});
// app.post("/api/chat/conversations", (req, res) => {
//   res.send("Hello World! from chat route");
// });

// app.get("/api/chat/conversations", (req, res) => {
//   res.send("Hello World! from conversation route");
// });

async function startServer() {
  try {
    const client = await db.connect();
    client.release();
    console.log("Db connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      console.log("Server is running on port http://localhost:5000");
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
app.use(errorHandler);
startServer();
