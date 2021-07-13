// if(document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', afterLoaded);
// } else {
//     //The DOMContentLoaded event has already fired. Just run the code.
//     afterLoaded();
// }

// function afterLoaded() {
//     var btnSignUp = document.getElementById("btn-signup");
//     var btnLogin = document.getElementById("btn-login");
//     var btnVerify = document.getElementById("verify-btn");
//     var btnLogout = document.getElementById("item-logout");
//     btnLogout.style.display = 'none';

//     if (btnSignUp){
//         btnSignUp.onclick = (e)=>{
//             e.preventDefault();
//             payload = {
//                 email: document.getElementById("email-signup").value,
//                 first_name: document.getElementById("firstname-signup").value,
//                 last_name: document.getElementById("lastname-signup").value,
//                 password1: document.getElementById("password1-signup").value,
//                 password2: document.getElementById("password2-signup").value,
//                 user_name: document.getElementById("username-signup").value,
//             }
        
//             postData("api/user/register", payload)
//             .then((response)=> {
//                 if (!response.ok){
//                     let err = new Error(response.status)
//                     err.response = response.json()
//                     err.status = response.status
//                     throw err 
//                 }
//                 alert("register success");
//                 window.location.replace("/login");
//                 btnSignUp.style.display = 'block';
//                 btnLogin.style.display = 'block';
//             })
//             .catch((error) => {
//                 alert(error.response.message);
//             });
//         }    
//     }

//     if (btnLogin){
//         btnLogin.onclick = (e)=>{
//             e.preventDefault();
//             payload = {
//                 email: document.getElementById("email-login").value,
//                 password1: document.getElementById("password-login").value,
//             }

//             postData("auth/login", payload)
//             .then((response)=> {
//                 if (!response.ok){
//                     let err = new Error(response.status)
//                     err.response = response.json()
//                     err.status = response.status
//                     throw err 
//                 }

//                 data = response.json();
//                 window.location.replace("/verify");
//                 // btnSignUp.style.display = 'block';
//                 // btnLogin.style.display = 'block';
//             }
//             )
//             .catch((error) => {
//                 alert("Invalid email or password format");
//             });
//         }
//     }

//     if (btnVerify){
//         btnVerify.onclick = (e) => {
//             e.preventDefault();
//             payload = {
//                 password: document.getElementById("input-verify").value
//             };

//             // const token = localStorage.getItem('access_token');
//             // let headers = { 
//             //     "alg": "HS256",
//             //     "typ": "JWT",
//             //     'Authorization': 'Bearer '+token,
//             //     'Content-Type': 'application/json'
//             // };
//             postData("auth/verify", payload)
//             .then(response => {
//                     if (!response.ok){
//                         let err = new Error(response.status)
//                         err.response = response.json()
//                         err.status = response.status
//                         throw err 
//                     }
//                     // btnSignUp.style.display = 'none';
//                     // btnLogin.style.display = 'none';
//                     data = response.json();
//                     document.getElementById("user-name-title").innerHTML = "Welcome, \'' + data.user_name + '\' !";
//                     window.location.replace("/profile");
//                     // document.getElementById("item-logout").style.display = 'block';
//                 }
//             )
//             .catch((error) => {
//                 alert(error.response.message);
//                 // window.location.replace("/login");
//             });
//         }
//     }
// };

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
