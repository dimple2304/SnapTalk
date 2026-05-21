const settingsButton = document.querySelector(".setting-btn");
const logoutButton = document.querySelector(".logout-btn");

if (settingsButton) {
    settingsButton.addEventListener("click", function () {
        logoutButton.classList.toggle("hidden");
    })
}

logoutfunc(logoutButton);