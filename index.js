const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoute");
const socket = require("socket.io");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

mongoose
  .connect(
    "mongodb+srv://Srinivas:srinivasbhat@cluster0.uiww1zj.mongodb.net/chatapp?retryWrites=true&w=majority",

    // "mongodb://localhost:27017/chatapp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DataBase is Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(PORT, () => {
  console.log("Connection Successful");
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // console.log("sendmsg", {data})
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
