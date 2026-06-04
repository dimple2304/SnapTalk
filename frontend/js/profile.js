const uploadIcon = document.querySelector("#banner-upload-icon");
const bannerPicInput = document.querySelector("#banner-pic-input");
const bannerDiv = document.querySelector("#banner-div");
const spinner = document.querySelector("#spinner");
const tabControls = document.querySelector("#tab-controls");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

if (uploadIcon) {
    uploadIcon.addEventListener("click", () => bannerPicInput.click());
}

if (bannerPicInput) {
    bannerPicInput.addEventListener("change", async function (e) {
        try {
            const file = e.target.files[0];
            console.log(file);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("folder", "bannerImage");

            spinner.classList.remove("hidden");

            const res = await fetch("/api/account/upload-file", {
                method: "POST",
                body: formData
            })

            const data = await res.json();

            const result = await fetch("/api/account/upload-banner", {
                method: "PATCH",
                headers: { "Content-Type": "Application/json" },
                body: JSON.stringify({ url: data.fileUrl, fileId: data.fileId })
            })

            const resultData = await result.json();

            if (!result.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Action Failed",
                    text: "We couldn't process your request at the moment. Please try again later.",
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#ef4444",
                    background: "#f9fafb",
                    color: "#111827",
                    showClass: {
                        popup: "animate__animated animate__fadeInDown"
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutUp"
                    },
                });
                spinner.classList.add("hidden");
                return;
            }
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    })
}

// tab toggeling
const activeClasses = ["font-bold", "text-indigo-600", "border-b-2", "border-indigo-600"];
const inactiveClasses = ["font-medium", "hover:underline", "hover:text-indigo-600"];

document.addEventListener("DOMContentLoaded", () => {
    initializeTabs(
        tabControls,
        tabBtns,
        tabPanes,
        activeClasses,
        inactiveClasses,
        "profileTabs"
    );

});

const logOutBtn = document.querySelector(".logOutBtn");
const settingsBtn = document.querySelector(".settingsBtn");
if (settingsBtn) {
    settingsBtn.addEventListener("click", function () {
        logOutBtn.classList.toggle("hidden");
    })
    document.addEventListener("click", function (e) {
        if (!settingsBtn.contains(e.target)) {
            logOutBtn.classList.add("hidden");
        }
    })
    logoutfunc(logOutBtn);
}






