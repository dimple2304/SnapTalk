const editProfileBtn = document.querySelector("#edit-profile-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");


editProfileBtn.addEventListener("click", function () {
    Swal.fire({
        html: editProfileModal.innerHTML,
        showConfirmButton: false,
        showCloseButton: true,
    });

    let skipBtn = document.querySelector(".swal2-container [data-action=skip]");
    let backBtn = document.querySelector(".swal2-container [data-action=back]");

    let current = 1;
    skipBtn.addEventListener("click", function () {
        let total = 5;

        current += 1;

        document.querySelector(`.swal2-container #step-${current}`).classList.remove("hidden");

        if ((current - 1) != 0) {
            document.querySelector(`.swal2-container #step-${current - 1}`).classList.add("hidden");
        }
    })
})


