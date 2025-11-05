const postMediaInput = document.querySelector("#post-media-input");
const thought = document.querySelector("#thought");
const previewDiv = document.querySelector("#preview-div");
const postBtn = document.querySelector("#post-btn");
const previewSpinner = document.querySelector("#preview-spinner #spinner");
const createPostSpinner = document.querySelector("#create-post-spinner #spinner");
const createPostError = document.querySelector("#create-post-error");
const postdynamicimg = document.querySelector(".postdynamicimg");


let fileId;

const mediaPreview = document.createElement("img");
previewDiv.appendChild(mediaPreview);

postMediaInput.addEventListener("change", async function (e) {
    const mediaFiles = postMediaInput.files;
    if (mediaFiles.length > 0) {
        postBtn.disabled = false;
        const file = e.target.files[0];
        console.log(file);
        previewSpinner.classList.remove("hidden");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("folder", "postsMedia");

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                mediaPreview.classList.add("w-45", "max-h-[350px]", "h-45", "mt-4", "object-cover", "border-4", "border-slate-200");
                mediaPreview.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }

        const res = await fetch("/api/account/upload-file", {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        mediaPreview.src = data.fileUrl
        fileId = data.fileId

        previewSpinner.classList.add("hidden");
        console.log(data);

    }
})

thought.addEventListener("input", function () {
    const thoughtValue = thought.value.trim();
    if (thoughtValue) { postBtn.disabled = false }
    else { postBtn.disabled = true };
})

postBtn.addEventListener("click", async function () {
    const mediaVal = mediaPreview.getAttribute("src");
    const thoughtVal = thought.value.trim();

    createPostError.innerHTML = "";

    createPostSpinner.classList.remove("hidden");


    const content = {
        url: mediaVal,
        fileId: fileId,
        thought: thoughtVal
    }

    const res = await fetch("/api/create/create-post", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(content)
    })

    const data = await res.json();

    createPostSpinner.classList.add("hidden");

    if (!res.ok) {
        createPostError.innerHTML = data.message;
    }

    const mediaFile = postMediaInput.files;
    console.log(mediaVal);

    thought.value = "";
    postMediaInput.value = "";
    mediaPreview.classList.add("hidden");
    postBtn.disabled = true;

    window.location.reload();
})











