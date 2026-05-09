const followBtn = document.querySelectorAll(".followBtn");
const followBtnFromProfile = document.querySelector(".followBtnProfile")
const followBtnArray = Array.from(followBtn);
const followError = document.querySelectorAll(".follow-error")
const followErrorFromProfile = document.querySelector("#follow-error")

if (followBtnFromProfile) {
    followBtnFromProfile.addEventListener("click", async function (e) {
        try {
            followErrorFromProfile.innerHTML = "";
            const postOwnerUserId = followBtnFromProfile.getAttribute("data-profileOwnerId");
            console.log("profileOwnerUserId: " + postOwnerUserId);

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

            window.location.reload();

        } catch (error) {
            followErrorFromProfile.innerHTML = error.message || "An error occurred";
        }
    })
}


followBtnArray.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
        try {
            followError.innerHTML = "";
            const postOwnerUserId = this.getAttribute("data-postOwnerUserId");
            console.log("postID" + postOwnerUserId);

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
            }
            window.location.reload();
        } catch (error) {
            followError.innerHTML = error.message || "An error occurred";
            return error;
        }
    })
})