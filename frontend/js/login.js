const signinBtn = document.querySelector("#signin-btn");
const loginDialog = document.querySelector("#login-dialog");
const loginModalClose = document.querySelector("#loginModal-close");
console.log(loginModalClose);


loginModalClose.addEventListener("click", function(){
    loginDialog.close();
})

signinBtn.addEventListener("click", async function(){
    loginDialog.showModal();
})

