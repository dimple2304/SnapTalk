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

export function notificationCounter(unreadNotificationCount) {
    if (unreadNotificationCount) {
        unreadNotificationCount.classList.remove("hidden");

        let currentCount = Number(unreadNotificationCount.innerHTML);
        unreadNotificationCount.innerHTML = currentCount + 1;

        if (Number(unreadNotificationCount.innerHTML) <= 0) {
            unreadNotificationCount.classList.add("hidden");
        }
    }
}


export function toastify(text) {
    Toastify({
        text: text,
        duration: 2500,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#111827",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            fontWeight: "500",
            fontSize: "14px"
        }
    }).showToast();
}


