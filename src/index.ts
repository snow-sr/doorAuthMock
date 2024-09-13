import door from "./routes/door/door_functions.js";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { loginUser } from "./routes/user/user_authentication.js";

import teste from "./routes/user/user_functions.js"
import bodyParser from "body-parser";
const port: number = 8087;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json())

app.use('/', teste)
app.post('/login', async (req, res) => {require 
  try {
      console.log(req.body)
      
      const email = req.body.email
      const password = req.body.password
      console.log(password)
      if (!email || !password) {
          return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Lógica de login vai aqui
      const { token } = await loginUser(email, password);
      return res.status(200).json(token)
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// allow all origins
app.use(cors()); // Allow all origins
app.use(door);

app.get("/", (req: express.Request, res: express.Response) => {
  console.log(req.ip);
  res.send("System working");
});

// socket
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});

export const updateFront = () => {
  io.emit("updateFront", true);
};
