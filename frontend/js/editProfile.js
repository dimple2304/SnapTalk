const editProfileBtn = document.querySelector("#edit-profile-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");



editProfileBtn.addEventListener("click", function () {
    Swal.fire({
        html: editProfileModal.innerHTML,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            const profilePicInput = swalContainer.querySelector("#profile-pic-input");
            const label = swalContainer.querySelector("#profile-pic-label");
            const nameInput = swalContainer.querySelector("#name-input");
            const usernameInput = swalContainer.querySelector("#username-input");
            const bioInput = swalContainer.querySelector("#bio-input");
            const linkLabelInput = swalContainer.querySelector("#link-label-input");
            const linkUrlInput = swalContainer.querySelector("#link-url-input");
            const saveBtn = swalContainer.querySelector("#save-changes");
            const editError = swalContainer.querySelector("#edit-error");
            const editSpinner = swalContainer.querySelector(".editSpinner #spinner");
            const preview = swalContainer.querySelector("#image-preview")
            const nameError = swalContainer.querySelector("#name-error")
            const usernameError = swalContainer.querySelector("#username-error")
            let fileId;

            profilePicInput.addEventListener("change", async function (e) {
                const file = e.target.files[0];
                console.log(file);
                
                const formData = new FormData();
                formData.append("file", file);
                formData.append("filename", file.name);
                formData.append("folder", "profilepic");

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        preview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }

                const res = await fetch("/api/account/upload-file", {
                    method:"POST",
                    body:formData
                })

                const data = await res.json();
                preview.src = data.fileUrl;
                fileId = data.fileId;
                console.log(data);
                

            })
            label.addEventListener("click", () => profilePicInput.click());

            saveBtn.addEventListener("click", async function () {
                const profilePicVal = preview.getAttribute("src");
                const nameVal = nameInput.value;
                const usernameVal = usernameInput.value.trim();
                const bioVal = bioInput.value;
                const labelVal = linkLabelInput.value;
                const urlVal = linkUrlInput.value;

                editError.innerHTML = "";
                nameError.innerHTML = "";
                usernameError.innerHTML = "";

                let hasError = false;

                if(!nameVal) {
                    nameError.innerHTML = "Name is required.";
                    hasError = true;
                }
                if(!usernameVal){
                    usernameError.innerHTML = "Username is required.";
                    hasError = true;
                }

                if(hasError) return;

                const details = {
                    url: profilePicVal,
                    name: nameVal,
                    username: usernameVal,
                    bio: bioVal,
                    linkLabel: labelVal,
                    link: urlVal,
                    fileId: fileId
                };
                console.log(details);
                

                try {
                    editSpinner.classList.remove("hidden");

                    const res = await fetch("/api/account/edit-profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "Application/json" },
                        body: JSON.stringify(details)
                    });

                    const data = await res.json();
                    console.log(data);


                    editSpinner.classList.add("hidden");

                    if (!res.ok) {
                        editError.innerHTML = data.message;
                    }
                    Swal.close();
                    window.location.reload();

                } catch (err) {
                    editError.innerHTML = data.message;
                    editSpinner.classList.add("hidden");
                }
            })
        }
    });
})


