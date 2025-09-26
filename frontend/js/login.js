const submitBtn = document.querySelector("#submit-btn");
const loginDialog = document.querySelector("#login-dialog");
const loginModalClose = document.querySelector("#loginModal-close");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginEmailError = document.querySelector("#loginEmailError");
const loginPasswordError = document.querySelector("#loginPasswordError");
const signupRedirect = document.querySelector("#signupRedirect");
const passToggler = document.querySelector("#passToggler");
const spinner = document.querySelector("#spinner");

loginModalClose.addEventListener("click", function () {
    window.location.href = "/";
    overlay.classList.remove("opacity-100");
})

submitBtn.addEventListener("click", async function(e){
    e.preventDefault();
    try{
        loginEmailError.innerHTML = "";
        loginPasswordError.innerHTML = "";

        const emailVal = loginEmail.value.trim();
        const passwordVal = loginPassword.value.trim();

        spinner.classList.remove("hidden");

        const credentials = {
            email:emailVal,
            password:passwordVal
        }

        const res = await fetch("/api/auth/login", {
            method:"POST",
            headers:{"Content-Type":"Application/json"},
            body:JSON.stringify(credentials)
        })

        const data = await res.json();
        spinner.classList.add("hidden");

        if(!res.ok){
            loginPasswordError.innerHTML = data.message;
            return;
        }

        window.location.href = data.redirectUrl;

    }catch(err){
        loginPasswordError.innerHTML = "Something went wrong.";
        spinner.classList.add("hidden");
        return;
    }
})


// Redirect for signup from login page if don't have an account
signupRedirect.addEventListener("click", function(){
    window.location.href = "/registration";
})

  //Visibility toggle
    passToggler.addEventListener("click", () => {
      toggleHandler(loginPassword, passToggler)
    });

    // add or remove class
    function toggleIcon(icon) {
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    }

    function toggleHandler(inputField, icon) {
      inputField.type = inputField.type === "password" ? "text" : "password";
      toggleIcon(icon);
    }



