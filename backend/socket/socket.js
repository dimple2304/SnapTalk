import { Server } from "socket.io";

const onlineUsers = {};
export function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        // when user join
        socket.on("join", (userId) => {
            onlineUsers[userId] = socket.id;
        })
        // user disconnect
        socket.on("disconnect", () => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    break;
                }
            }
        });

        // for like
        socket.on('new like', (data) => {
            const targetSocketId = onlineUsers[data.targetUserId];
            // socket.broadcast.emit('receive like', data)
            if (targetSocketId) {
                io.to(targetSocketId).emit("receive like", {
                    message: data.message
                })
            }
        })

        // for comment
        socket.on('new comment', (data) => {
            const targetSocketId = onlineUsers[data.targetUserId];
            if (targetSocketId) {
                io.to(targetSocketId).emit("receive comment", {
                    message: data.message
                })
            }
        })

        // for follow
        socket.on('new follower', (data) => {
            const targetSocketId = onlineUsers[data.targetUserId];
            if (targetSocketId) {
                io.to(targetSocketId).emit("receive follower", {
                    message: data.message
                })
            }
        })
    })
}
