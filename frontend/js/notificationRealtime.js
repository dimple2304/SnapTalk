// import notifyMe from './notification.js';
// import socket from './socketClient.js';
// const notificationContainer = document.querySelector(".notifications-container");

// socket.on('receive follower', (data) => {
//     notifyMe(data.message);
//     console.log("even emitted in receiver side");

//     if (notificationContainer) {
//         const div = document.createElement("div");
//         div.classList.add("bg-white", "border", "border-slate-200", "rounded-2xl", "p-4", "flex", "items-start", "gap-3", "hover:bg-slate-50", "transition", "cursor-pointer");
//         const p = document.createElement('p');
//         p.classList.add("text-sm", "text-gray-600", "mt-1");

//         p.innerHTML = data.message;

//         div.appendChild(p);
//         notificationContainer.prepend(div);
//         console.log(notificationContainer);
//     }
// })