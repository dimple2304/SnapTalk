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


    // realtime notification page update 
    // if (window.location.pathname === "/notification" && notificationContainer) {
    //     const div = document.createElement("div");
    //     div.classList.add("bg-white", "border", "border-slate-200", "rounded-2xl", "p-4", "flex", "items-start", "gap-3", "hover:bg-slate-50", "transition", "cursor-pointer");
    //     div.innerHTML = ` <div class="flex-1"> <div class="flex items-center justify-between"> <h3 class="font-semibold text-gray-900"> ${data.followedByUsername} </h3> 
    //     <span class="text-xs text-gray-400"> Just now </span> 
    //     </div> <p class="text-sm text-gray-600 mt-1"> 
    //     started following you </p> 
    //     </div> 
    //     <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2"></div> `;
    //     notificationContainer.prepend(div);
    // }
}


