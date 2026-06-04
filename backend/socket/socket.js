import { Server } from "socket.io";

const onlineUsers = {};
export function setupSocket(server) {
    const io = new Server(server);
    io.on("connection", (socket) => {
        // when user join
        socket.on("join", (userId) => {
            onlineUsers[userId] = socket.id;
            console.log("Online users:", onlineUsers);
        })

        // for like
        socket.on('new like', (data) => {
            const targetSocketId = onlineUsers[data.targetUserId];
            // socket.broadcast.emit('receive like', data)
            io.to(targetSocketId).emit("receive like", {
                message: data.message
            })
        })
    })
}
