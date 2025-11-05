const likeButtons = document.querySelectorAll(".like-button");
const likesCount = document.querySelectorAll(".likes-count");

const likeButtonArray = Array.from(likeButtons);
const likesCountArray = Array.from(likesCount);

likeButtonArray.forEach((button, i) => {
    button.addEventListener("click", async function () {
        const postId = this.getAttribute("data-postid");
        const userIdOfFeed = this.getAttribute("data-userIdOfFeed").toString();
        console.log("user:", userIdOfFeed);

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

        console.log("likes", data.likes);

        let isLiked = false;
        data.likes.map((e) => {
            if (e.user.toString() === userIdOfFeed) {
                return isLiked = true;
            }

        })
        console.log("isLiked:", isLiked);

        if (isLiked) {
            button.classList.add("text-pink-500");
            button.classList.remove("hover:text-pink-500");
        } else {
            button.classList.remove("text-pink-500");
            button.classList.add("hover:text-pink-500");
        }

    });
});