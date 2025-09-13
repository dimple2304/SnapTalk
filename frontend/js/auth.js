const registerDialog = document.querySelector("#register-dialog");
const createacBtn = document.querySelector("#createac-btn");
const registrationForm = document.querySelector("#registrationForm");
const otpVerificationForm = document.querySelector("#otpVerificationForm");
const signupModalClose = document.querySelector("#signupModal-close");
const name = document.querySelector("#name");
const nameError = document.querySelector("#nameError");
const email = document.querySelector("#email");
const emailError = document.querySelector("#emailError");
const selectMonthV = document.querySelector("#select-month");
const selectDayV = document.querySelector("#select-day");
const selectYearV = document.querySelector("#select-year");
const dateError = document.querySelector("#dateError");
const nextBtn = document.querySelector("#next-btn");
const spinner = document.querySelector("#spinner");
const resendBtn = document.querySelector("#resend-btn");
const otpForm = document.querySelector("#otp-form");
const otpError = document.querySelector("#otpError");
const verifyBtn = document.querySelector("#verify-btn");
const otp = document.querySelector("#otp");
const minutesCounter = document.querySelector("#minutesCounter");
const secondsCounter = document.querySelector("#secondsCounter");
const inSeparator = document.querySelector("#inSeparator");
const passwordCreationForm = document.querySelector("#passwordCreationForm");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const confirmPasswordError = document.querySelector("#confirmPasswordError");
const passLengthError = document.querySelector("#passLengthError");
const upperCaseError = document.querySelector("#upperCaseError");
const lowerCaseError = document.querySelector("#lowerCaseError");
const numberError = document.querySelector("#numberError");
const specialCharError = document.querySelector("#specialCharError");
const confirmBtn = document.querySelector("#confirm-btn");
const passToggler = document.querySelector("#passToggler");
const confirmPassToggler = document.querySelector("#confirmPassToggler");

signupModalClose.addEventListener("click", () => {
    registerDialog.close();
})
createacBtn.addEventListener("click", () => {
    registerDialog.showModal();
});

let nameTouched = false;
let emailTouched = false;
let dobTouched = false;

name.addEventListener("focus", () => nameTouched = true);
email.addEventListener("focus", () => emailTouched = true);
selectMonthV.addEventListener("focus", () => dobTouched = true);
selectDayV.addEventListener("focus", () => dobTouched = true);
selectYearV.addEventListener("focus", () => dobTouched = true);

function isNameValid() {
    const val = name.value.trim();
    return val && val.length <= 25 && /^[a-zA-Z\s]+$/.test(val);
}

function isEmailValid() {
    const val = email.value.trim();
    return val && /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(val);
}

function isDOBValid() {
    const month = selectMonthV.value;
    const day = parseInt(selectDayV.value);
    const year = parseInt(selectYearV.value);
    return month && day && year && year <= 2009;
}

function showNameError() {
    if (!nameTouched) return;
    const val = name.value.trim();
    if (!val) {
        nameError.innerHTML = "Please enter your name!";
    }
    else if (val.length > 25) {
        nameError.innerHTML = "Name can have only 25 maximum characters.";
    }
    else if (!/^[a-zA-Z\s]+$/.test(val)) {
        nameError.innerHTML = "Name can only contain letters and spaces.";
    }
    else {
        nameError.innerHTML = "";
    }
}

function showEmailError() {
    if (!emailTouched) {
        return;
    }
    const val = email.value.trim();
    if (!val) {
        emailError.innerHTML = "Please enter your email!";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(val)) {
        emailError.innerHTML = "Please enter a valid email address.";
    }
    else {
        emailError.innerHTML = "";
    }
}

function showDOBError() {
    if (!dobTouched) {
        return;
    }
    const month = selectMonthV.value;
    const day = parseInt(selectDayV.value);
    const year = parseInt(selectYearV.value);
    if (!month || !day || !year) {
        return;
    }
    else if (year > 2009) {
        dateError.innerHTML = "Age must be greater than 16!";
    }
    else {
        dateError.innerHTML = "";
    }
}

function handleFormChange() {
    showNameError();
    showEmailError();
    showDOBError();

    nextBtn.disabled = !(isNameValid() && isEmailValid() && isDOBValid());
}

name.addEventListener("input", handleFormChange);
email.addEventListener("input", handleFormChange);
selectMonthV.addEventListener("change", handleFormChange);
selectDayV.addEventListener("change", handleFormChange);
selectYearV.addEventListener("change", handleFormChange);


// OTP time counter
let id;
let timeOver = false;
let minutes = 0;
let seconds = 0;

function startTimer(min, sec) {
    clearInterval(id);

    minutes = min;
    seconds = sec;
    timeOver = false;
    resendBtn.disabled = true;

    id = setInterval(countTime, 1000);
}

function countTime() {
    if (minutes === 0 && seconds === 0) {
        clearInterval(id);
        minutesCounter.innerHTML = "";
        secondsCounter.innerHTML = "";
        inSeparator.innerHTML = "";
        timeOver = true;
        resendBtn.disabled = false;
        return;
    }

    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }
    minutesCounter.innerHTML = minutes < 10 ? "0" + minutes + ":" : minutes + ":";
    secondsCounter.innerHTML = seconds < 10 ? "0" + seconds : seconds;
}

// Next button for email verification
nextBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
        nameError.innerHTML = "";
        emailError.innerHTML = "";
        dateError.innerHTML = "";
        resentMsg.innerHTML = "";

        const emailVal = email.value.trim();

        spinner.classList.remove("hidden");

        const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ email: emailVal })
        })

        const data = await res.json();
        spinner.classList.add("hidden");

        if (!res.ok) {
            emailError.innerHTML = data.message;
        }
        else if (data.success) {
            registrationForm.classList.add("hidden");
            otpVerificationForm.classList.remove("hidden");
            id = setInterval(() => startTimer(4, 59), 1000);
        }
        else {
            dateError.innerHTML = "Error sending otp, Please try again!"
        }
    } catch (err) {
        console.log(err);
        emailError.innerHTML = "Something went wrong. Please check your internet and try again.";
        spinner.classList.add("hidden");
    }
})


// Resend otp
const relative = document.querySelector("#append-relative");
const resentMsg = document.createElement("span")
resendBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
        otpError.innerHTML = "";
        resentMsg.innerHTML = "";

        resendBtn.classList.remove("cursor-pointer")
        spinner.classList.remove("hidden");

        const emailVal = email.value.trim();

        const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ email: emailVal })
        })
        const data = await res.json();
        spinner.classList.add("hidden");

        if (!res.ok) {
            otpError.innerHTML = data.messaage;
        } else if (data.success) {
            resentMsg.innerHTML = "OTP re-sent to your registered email.";
            resentMsg.style.color = "green";
            relative.appendChild(resentMsg);
            id = setInterval(() => startTimer(4, 59), 1000);
        }
    } catch (err) {
        console.log("Catch triggered" + err);
        otpError.innerHTML = "Something went wrong!";
        spinner.classList.add("hidden");
        return;
    }
})


// Prevention from all default submissions 
otpForm.addEventListener("submit", function (e) {
    e.preventDefault();
})

// Visibility of verify & next button
otp.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '')
    if (e.target.value.length == 6) {
        verifyBtn.disabled = false;
    } else {
        verifyBtn.disabled = true;
    }
})

// Verify otp
verifyBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
        otpError.innerHTML = "";
        resentMsg.innerHTML = "";
        console.log(timeOver);

        if (timeOver) {
            otpError.innerHTML = "Invalid otp!";
            return;
        }

        const otpVal = otp.value.trim();
        const emailval = email.value.trim();

        spinner.classList.remove("hidden");

        const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ otp: otpVal, email: emailval })
        })
        const data = await res.json();
        spinner.classList.add("hidden");

        if (!res.ok) {
            otpError.innerHTML = data.message;
        }
        if (data.success) {
            otpVerificationForm.classList.add("hidden");
            passwordCreationForm.classList.remove("hidden");
        }

    } catch (err) {
        console.log(err);
        otpError.innerHTML = "Something went wrong!"
        spinner.classList.add("hidden");
    }
})


/*Validate passwords*/
//Password
password.addEventListener("input", function () {
    confirmPasswordError.innerHTML = "";
    passLengthError.classList.remove("text-green-600");
    upperCaseError.classList.remove("text-green-600");
    lowerCaseError.classList.remove("text-green-600");
    numberError.classList.remove("text-green-600");
    specialCharError.classList.remove("text-green-600");

    const passwordVal = password.value.trim();

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[@$!%*?&]/;

    passLengthError.innerHTML = "Must be at least 8 characters long";
    upperCaseError.innerHTML = "Must be at least 1 uppercase";
    lowerCaseError.innerHTML = "Must be at least 1 lowercase";
    numberError.innerHTML = "Must be at least 1 number";
    specialCharError.innerHTML = "Must be at least 1 special character"

    if (passwordVal.length < 8) {
        passLengthError.classList.add("text-red-600");
    } else {
        passLengthError.classList.remove("text-red-600");
        passLengthError.classList.add("text-green-600");
    }

    if (!(uppercaseRegex.test(passwordVal))) {
        upperCaseError.classList.add("text-red-600");
    } else {
        upperCaseError.classList.remove("text-red-600");
        upperCaseError.classList.add("text-green-600")
    }

    if (!(lowercaseRegex.test(passwordVal))) {
        lowerCaseError.classList.add("text-red-600");
    } else {
        lowerCaseError.classList.remove("text-red-600");
        lowerCaseError.classList.add("text-green-600");
    }

    if (!(numberRegex.test(passwordVal))) {
        numberError.classList.add("text-red-600");
    } else {
        numberError.classList.remove("text-red-600");
        numberError.classList.add("text-green-600");
    }

    if (!(specialCharRegex.test(passwordVal))) {
        specialCharError.classList.add("text-red-600");
    } else {
        specialCharError.classList.remove("text-red-600");
        specialCharError.classList.add("text-green-600");
    }

    confirmPass()
})

// Confirm password
confirmPassword.addEventListener("input", confirmPass);
// Function for confirm password validation
function confirmPass() {
    confirmPasswordError.innerHTML = "";

    confirmBtn.disabled = true

    const passwordVal = password.value.trim();
    const confirmPasswordVal = confirmPassword.value.trim();

    if (confirmPasswordVal.length !== 0 && confirmPasswordVal === passwordVal) {
        confirmBtn.disabled = false
    } else if (confirmPasswordVal !== passwordVal && confirmPasswordVal.length !== 0) {
        confirmPasswordError.innerHTML = "Password doesn't match! Please recheck and try again.";
    }
}

// Visibility toggle
passToggler.addEventListener("click", () => {
    toggleHandler(password, passToggler)
});
confirmPassToggler.addEventListener("click", () => {
    toggleHandler(confirmPassword, confirmPassToggler)
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


// Save user details and redirect to the homepage
confirmBtn.addEventListener("click", async function(e){
    e.preventDefault();

    try{
        confirmPasswordError.innerHTML = "";

        const userDetails = {
            name:name.value.trim(),
            email:email.value.trim(),
            month:selectMonthV.value.trim(),
            day:selectDayV.value.trim(),
            year:selectYearV.value.trim(),
            password:password.value.trim()
        }

        spinner.classList.remove("hidden");

        const res = await fetch("/api/auth/register-user", {
            method:"POST",
            headers:{"Content-Type":"Application/json"},
            body:JSON.stringify(userDetails)
        });
   
        const data = await res.json();
        
        if(!res.ok){
            confirmPasswordError.innerHTML = data.message;
            spinner.classList.add("hidden");
            return;
        }
        window.location.href = data.redirectUrl;

    }catch(err){
        confirmPasswordError.innerHTML = "Something went wrong!";
        spinner.classList.add("hidden");
        console.log(err);     
    }
})





