const socket = io();

const currentUserId = document.body.dataset.currentUserId;

if (currentUserId) {
    socket.emit("join", currentUserId);
}

export default socket;