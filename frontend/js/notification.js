import getPostTime from "./postTimeFormatter.js";

function notifyMe(value) {
    if (Notification.permission === "granted") {
        new Notification("SnapTalk", {
            body: value,
            icon: "/images/logo2.png"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("SnapTalk", {
                    body: value,
                    icon: "/images/logo2.png"
                });
            }
        });
    }
}

export default notifyMe;


const notificationTime = document.querySelectorAll(".notification-time");
if (notificationTime) {
    notificationTime.forEach(e => {
        const rawDate = e.innerHTML;
        e.innerHTML = getPostTime(rawDate)
    });
}

// const unreadDots = document.querySelectorAll(".unread-dot");
// const markAllReadBtn = document.querySelector("#mark-all-read-btn");
// if(unreadDots){
//     markAllReadBtn.addEventListener("click", function(){
//         unreadDots.forEach(dot => {
//             dot.style.display = "none";
//         })
//     })
// }

