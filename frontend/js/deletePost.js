const postMenus = document.querySelectorAll(".postMenu");
const postDeleteBtn = document.querySelectorAll(".postDeleteBtn");

let source;
const currentpath = window.location.pathname;


if (postMenus) {
    postMenus.forEach((menu, i) => {
        menu.addEventListener("click", function () {
            postDeleteBtn[i].classList.toggle("hidden");
        })
        document.addEventListener("click", function (e) {
            if (!menu.contains(e.target) && !postDeleteBtn[i].contains(e.target)) {
                postDeleteBtn[i].classList.add("hidden");
            }
        })

        postDeleteBtn[i].addEventListener("click", async function () {
            try {
                const postId = this.getAttribute("data-postid");
                if (!postId) {
                    return;
                }
                const res = await fetch(`/api/create/delete-post?postId=${postId}&page=profile`, {
                    method: "DELETE"
                });
                const data = await res.json();

                if (!res.ok) {
                    return;
                }

                window.location.href = data.redirectUrl;
                // window.location.reload();
            } catch (error) {
                console.log(error);
            }
        })
    })
}
