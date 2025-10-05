const uploadIcon = document.querySelector("#banner-upload-icon");
const bannerPicInput = document.querySelector("#banner-pic-input");
const bannerDiv = document.querySelector("#banner-div");
const spinner = document.querySelector("#spinner");

uploadIcon.addEventListener("click", () => bannerPicInput.click());

bannerPicInput.addEventListener("change", async function (e) {
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
        body: JSON.stringify({ banner: data.fileUrl })
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
        return;
    }
    // window.location.reload();
})
