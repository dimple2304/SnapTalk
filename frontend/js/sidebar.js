const settingsButton = document.querySelector(".setting-btn");
const logoutButton = document.querySelector(".logout-btn");

if (settingsButton) {
    settingsButton.addEventListener("click", function () {
        logoutButton.classList.toggle("hidden");
    })

    document.addEventListener("click", function (e) {
        if (!settingsButton.contains(e.target)) {
            logoutButton.classList.add("hidden");
        }
    })
}

logoutfunc(logoutButton);