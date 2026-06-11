const likeButtons = document.querySelectorAll(".like-button");
const likesCount = document.querySelectorAll(".likes-count");
const likeButtonArray = Array.from(likeButtons);
const likesCountArray = Array.from(likesCount);
const commentInput = document.querySelector(".comment-input");
const commentPostBtn = document.querySelector(".comment-post-btn");
const commentError = document.querySelector("#comment-error");
const commentPost = document.querySelector(".comment-post");
const spinners = document.querySelector("#commentPostSpinner #spinner");
const commentsLen = document.querySelector("#comments-len");
const commentDeleteBtn = document.querySelectorAll(".commentDltBtn");

import notifyMe, { notificationCounter, toastify } from "./notification.js";
import socket from "./socketClient.js";
const currentUserId = document.body.dataset.currentUserId;

let unreadNotificationCount = document.querySelector("#unread-notification-count");

socket.on('receive like', async (data) => {
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
});

socket.on('receive comment', async (data) => {
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


likeButtonArray.forEach((button, i) => {
    button.addEventListener("click", async function () {
        const postId = this.getAttribute("data-postid");

        const res = await fetch('/api/create/like-post', {
            method: "POST",
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ postId })
        })

        const data = await res.json();

        if (!res.ok) {
            data.message
        }

        console.log("likesCount:", data.likesCount);
        if (data.likesCount > 0) {
            likesCount[i].innerHTML = data.likesCount;
        } else {
            likesCount[i].innerHTML = "";
        }

        let isLiked = false;
        data.likes?.map((e) => {
            if (e.user.toString() === currentUserId) {
                return isLiked = true;
            }

        })

        console.log("isLiked:", isLiked);

        if (isLiked) {
            button.classList.add("text-pink-500");
            button.classList.remove("hover:text-pink-500");

            if (data.postOwnerId !== currentUserId) {
                socket.emit('new like', {
                    message: `${data.likedByUsername} liked your post.`,
                    targetUserId: data.postOwnerId
                });
            }
        } else {
            button.classList.remove("text-pink-500");
            button.classList.add("hover:text-pink-500");
        }

    });
});


if (commentInput) {
    commentInput.addEventListener("input", function () {
        const commentInputVal = commentInput.value.trim();
        if (commentInputVal) return commentPostBtn.disabled = false;
        return commentPostBtn.disabled = true;
    })

    commentPostBtn.addEventListener("click", async function (e) {
        try {
            e.preventDefault();
            const commentInputVal = commentInput.value.trim();

            if (!commentInputVal) return;
            const postId = commentPost.getAttribute("data-commentPostId");

            commentError.innerHTML = "";
            spinners.classList.remove("hidden");

            const inputs = {
                commentInput: commentInputVal,
                postId: postId
            }
            console.log("inputs:", inputs);

            const res = await fetch('/api/create/comment-post', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs)
            });

            const data = await res.json();

            if (!res.ok) {
                commentError.innerHTML = data.message;
                spinners.classList.add("hidden");
                return;
            }

            if (data.postOwnerId !== currentUserId) {
                socket.emit("new comment", {
                    message: `${data.commentByUsername} commented on your post`,
                    targetUserId: data.postOwnerId
                })
            }

            spinners.classList.add("hidden");
            window.location.reload();
        } catch (error) {
            commentError.innerHTML = data.message;
            spinners.classList.add("hidden");
            return
        }
    })

}


commentDeleteBtn.forEach(btn => {
    btn.addEventListener("click", async function (e) {
        try {
            e.preventDefault();
            const postPagePath = window.location.pathname;
            const commentPostDltId = postPagePath.slice(postPagePath.lastIndexOf('/') + 1, postPagePath.length);
            if (!commentPostDltId) return;

            const commentId = btn.getAttribute("data-commentId");

            const inputs = {
                postId: commentPostDltId,
                commentId: commentId
            }

            const res = await fetch("/api/create/comment-delete", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs)
            })

            const data = await res.json();

            if (!res.ok) {
                return;
            }
            window.location.reload();
        } catch (error) {
            return
        }
    })
})


document.querySelectorAll(".share-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const postUrl = btn.dataset.postpageurl;
        const url = `${window.location.origin}${postUrl}`;
        await navigator.clipboard.writeText(url);

        toastify("Link copied successfully");
    });
});
