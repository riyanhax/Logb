document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const verifyForm = document.querySelector("#verify");

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        let payload = {
            email: document.getElementById("email-login").value,
            password1: document.getElementById("password-login").value,
        }

        postData("auth/login", payload)
        .then((response)=> {
            if (!response.ok){
                let err = new Error(response.status)
                err.response = response.json()
                err.status = response.status
                throw err 
            }

            loginForm.classList.add("form--hidden");
            verifyForm.classList.remove("form--hidden");
        }
        )
        .catch((error) => {
            alert("Invalid email or password format");
        });
    });

    verifyForm.addEventListener("submit", e => {
        e.preventDefault();

        let payload = {
            password: document.getElementById("input-verify").value
        };

        postData("auth/verify", payload)
        .then(response => {
                if (!response.ok){
                    let err = new Error(response.status);
                    err.response = response.json();
                    err.status = response.status;
                    throw err 
                }
                return response.json();
            }
        )
        .then(
            response => {
                let data = response.data;
                sessionStorage.setItem("jwt-token", data.access_token);
                window.location.replace("/profile");
            }
        )
        .catch((error) => alert(error.response.message));
    });

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        window.location.replace("/signup");
    });
})