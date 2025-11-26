const likeButtons = document.querySelectorAll(".like-button");
const likesCount = document.querySelectorAll(".likes-count");
const likeButtonArray = Array.from(likeButtons);
const likesCountArray = Array.from(likesCount);
const commentInput = document.querySelector(".comment-input");
const commentPostBtn = document.querySelector(".comment-post-btn");
const commentError = document.querySelector("#comment-error");
const commentPost = document.querySelector(".comment-post");
const spinner = document.querySelector("#commentPostSpinner #spinner");
const commentsLen = document.querySelector("#comments-len");

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

commentInput.addEventListener("input", function () {
    const commentInputVal = commentInput.value.trim();
    if (commentInputVal) return commentPostBtn.disabled = false;
    return commentPostBtn.disabled = true;
})

commentPostBtn.addEventListener("click", async function (e) {
    try {
        e.preventDefault();
        const commentInputVal = commentInput.value.trim();
        console.log("Comment from user:", commentInputVal);
        
        if (!commentInputVal) return;
        const postId = commentPost.getAttribute("data-commentPostId");
        console.log("Post id:", postId);
        
        commentError.innerHTML = "";

        spinner.classList.remove("hidden");

        const inputs = {
            commentInput: commentInputVal,
            postId: postId
        }
        console.log("inputs:", inputs);
        

        const res = await fetch('/api/create/comment-post', {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify(inputs)
        });

        const data = await res.json();
        console.log("data:", data);
        
        if (!res.ok) {
            commentError.innerHTML = data.message;
            spinner.classList.add("hidden");
            return;
        }

        spinner.classList.add("hidden");
        
        window.location.reload();
    } catch (error) {
        commentError.innerHTML = data.message;
        spinner.classList.add("hidden");
        return
    }
})