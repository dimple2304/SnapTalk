const editProfileBtn = document.querySelector("#edit-profile-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");

editProfileBtn.addEventListener("click", function () {
    editProfileModal.classList.remove("hidden");
    Swal.fire({
        html: editProfileModal.innerHTML,
        showConfirmButton: false,
        showCloseButton: true,
    });
})

