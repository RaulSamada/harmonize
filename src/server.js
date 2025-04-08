const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const pidusage = require("pidusage");
const manager = require("../lib/manager_instance");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const htmlFilePath = path.join(__dirname, 'index.html');

app.get("/", (req, res) => {
    res.sendFile(htmlFilePath);
});

io.on("connection", (socket) => {
    console.log("Client connected");
    const interval = setInterval(() => {
        manager.processes.forEach(async (process) => {
            try {
                const stats = await pidusage(process.pid);
                process.cpu = stats.cpu;
                process.memory = (stats.memory / 1024 / 1024).toFixed(2);
            } catch (e) {
                console.error(`Error getting stats for PID ${process.pid}:`, e);
            }
        });
        socket.emit("processes", manager.processes);
    }, 2000);

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
