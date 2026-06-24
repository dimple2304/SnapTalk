const followBtn = document.querySelectorAll(".followBtn");
const followBtnFromProfile = document.querySelector(".followBtnProfile")
const followBtnArray = Array.from(followBtn);
const followError = document.querySelectorAll(".follow-error")
const followErrorFromProfile = document.querySelector("#follow-error")
const followBtnFromConnections = document.querySelectorAll(".followBtnFromConnections")
const followBtnFromSidebar = document.querySelectorAll(".followBtnFromSidebar")

import notifyMe, { notificationCounter } from './notification.js';
import socket from './socketClient.js';
let unreadNotificationCount = document.querySelector(".unread-notification-count");

//WHEN ON NOTIFICATION PAGE , NOTIFICATION MUST BE isRead:true by default
// one idea is that we can make a global function for notification creation
// which holds the current pathnam and if it contains '/notification' then upcoming 
// notifications must is isRead: true

socket.on('receive follower', async (data) => {
    if (window.location.pathname !== "/notification") {
        notifyMe(data.message);
        notificationCounter(unreadNotificationCount);
    } else {
        const res = await fetch("/api/account/isread-true", {
            method: "PATCH"
        })
        if (res.ok) {
            unreadNotificationCount.innerHTML = 0;
            unreadNotificationCount.classList.add("hidden");
        }
    }

})

if (followBtnFromConnections) {
    followBtnFromConnections.forEach((btns) => {
        btns.addEventListener("click", async function (e) {
            try {
                const postOwnerUserId = btns.getAttribute("data-profileOwnerUserId");

                const res = await fetch('/api/account/follow-system', {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postOwnerUserId })
                })

                const data = await res.json();

                if (!res.ok) {
                    return;
                }
                if (!data.isFollowing) {
                    btns.innerHTML = `<i class="ri-add-line text-base"></i> Follow`;
                } else {
                    btns.innerHTML = `<i class="ri-check-line text-base"></i> Following`

                    socket.emit('new follower', {
                        message: `${data.followedByUsername} started following you`,
                        targetUserId: data.followingUserId
                    })
                }

                window.location.reload();
            } catch (error) {
                return error;
            }
        })
    })
}

if (followBtnFromProfile) {
    followBtnFromProfile.addEventListener("click", async function (e) {
        try {
            followErrorFromProfile.innerHTML = "";
            const postOwnerUserId = followBtnFromProfile.getAttribute("data-profileOwnerId");

            const res = await fetch('/api/account/follow-system', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postOwnerUserId })
            })

            const data = await res.json();

            if (!res.ok) {
                followErrorFromProfile.innerHTML = data.message;
                return;
            }

            if (data.isFollowing) {
                socket.emit('new follower', {
                    message: `${data.followedByUsername} started following you`,
                    targetUserId: data.followingUserId
                })
            }

            window.location.reload();

        } catch (error) {
            followErrorFromProfile.innerHTML = error.message || "An error occurred";
        }
    })
}

if (followBtnFromSidebar) {
    followBtnFromSidebar.forEach((btn) => {
        btn.addEventListener("click", async function (e) {
            try {
                const postOwnerUserId = this.getAttribute("data-profileOwnerUserId");

                const res = await fetch('/api/account/follow-system', {
                    method: "PATCH",
                    headers: { "Content-TYpe": "application/json" },
                    body: JSON.stringify({ postOwnerUserId })
                })

                const data = await res.json();

                if (!res.ok) {
                    return;
                }

                if (data.isFollowing) {
                    socket.emit('new follower', {
                        message: `${data.followedByUsername} started following you`,
                        targetUserId: data.followingUserId
                    })
                }

                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        })
    })
}


followBtnArray.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
        try {
            followError.innerHTML = "";
            const postOwnerUserId = this.getAttribute("data-postOwnerUserId");

            const res = await fetch('/api/account/follow-system', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postOwnerUserId })
            })

            const data = await res.json();

            if (!res.ok) {
                followError.innerHTML = data.message;
                return;
            }

            if (data.isFollowing) {
                btn.innerHTML = "following";
                socket.emit('new follower', {
                    message: `${data.followedByUsername} started following you`,
                    targetUserId: data.followingUserId
                })
            }
            window.location.reload();
        } catch (error) {
            followError.innerHTML = error.message || "An error occurred";
            return error;
        }
    })
})