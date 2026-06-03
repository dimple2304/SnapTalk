const inputField = document.querySelector(".input-field");
const searchUserError = document.querySelector("#search-user-error");
const searchedUser = document.querySelector(".searchedUser");
const name = document.querySelector(".name");
const username = document.querySelector(".username");
const usersDiv = document.querySelector(".usersDiv");
const spinner = document.querySelector("#spinner");

if (inputField) {
    let timeout;
    inputField.addEventListener("input", async function () {
        clearTimeout(timeout);
        timeout = setTimeout(async function () {
            try {
                searchUserError.innerHTML = "";
                usersDiv.innerHTML = "";
                const value = inputField.value;

                if (!value.trim()) {
                    return;
                }

                spinner.classList.remove("hidden");
                const res = await fetch(`/api/explore/search-user?searchQuery=${value}`, {
                    method: "GET"
                });
                const data = await res.json();
                spinner.classList.add("hidden");
                console.log("data is:", data);

                if (!res.ok) {
                    searchUserError.innerHTML = data.message;
                }
                // WORKING ON PROFILE BACK BTN (BTN MUST BE BACK TO THE EXPLORE PAGE RATHER THAN FEED IF 
                // PROFILE IS OPENED FROM SEARCH BAR)
                if (data) {
                    data.users.forEach(u => {
                        const a = document.createElement("a");
                        a.href = `/profile/${u.username}`;
                        const div = document.createElement("div");
                        div.classList.add("searchedUser", "flex", "items-center", "gap-3", "px-3", "py-3", "rounded-xl", "hover:bg-slate-100", "transition", "cursor-pointer");
                        const img = document.createElement("img");
                        img.classList.add("pp", "w-11", "h-11", "rounded-full", "object-cover");
                        const h3 = document.createElement("h3");
                        h3.classList.add("name", "font-semibold", "text-gray-900");
                        const p = document.createElement("p");
                        p.classList.add("username", "text-sm", "text-gray-500");

                        img.src = u.profilepic || `https://placehold.co/128x128/1d4ed8/ffffff?text=${u.name.split('')[0].toUpperCase()}`;
                        h3.innerHTML = u.name;
                        p.innerHTML = "@" + u.username;

                        usersDiv.appendChild(a)
                        a.appendChild(div);
                        div.appendChild(img);
                        div.appendChild(h3);
                        div.appendChild(p);
                    });
                }
            } catch (error) {
                spinner.classList.add("hidden");
                console.log(error);
            }
        }, 500)

        if (!inputField.value.length) {
            usersDiv.innerHTML = "";
        }
    })
}