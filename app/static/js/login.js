const onSignUp = e => {
    e.preventDefault();
    const imgID = document.querySelector(".img-layout").dataset.id;
    window.location.href = `/signup/${imgID}`;
}

const onSignIn = e => {
    e.preventDefault();
    let payload = {
        email: document.getElementById("email-login").value,
        password1: document.getElementById("password-login").value,
    }

    postData("/auth/login", payload)
    .then(res => {
        if (!res.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err 
        }
        return res.json();
    })
    .then( 
        (data) => window.location.replace("/profile")
    )
    .catch(error => setInputError(e.target, "Tài khoản hoặc mật khẩu không đúng."))
}

const onEnterPress = e => {
    if (e.keyCode === 13) {
        onSignIn(e);
    }
}

window.addEventListener("load", () => {
    const btnLogin = document.querySelector(".btn-login");
    const loginForm = document.querySelector("#login");
    const btnSignup = document.querySelector(".btn-signup");

    btnSignup.addEventListener("click", onSignUp);
    btnLogin.addEventListener("click", onSignIn);
    loginForm.addEventListener("keyup", onEnterPress);

    //     postData("auth/login", payload)
    //     .then((response)=> {
    //         if (!response.ok){
    //             let err = new Error(response.status)
    //             err.response = response.json()
    //             err.status = response.status
    //             throw err 
    //         }

    //         loginForm.classList.add("form--hidden");
    //         verifyForm.classList.remove("form--hidden");
    //     }
    //     )
    //     .catch((error) => {
    //         alert("Invalid email or password format");
    //     });
    // });

    // verifyForm.addEventListener("submit", e => {
    //     e.preventDefault();

    //     let payload = {
    //         password: document.getElementById("input-verify").value
    //     };

    //     postData("auth/verify", payload)
    //     .then(response => {
    //             if (!response.ok){
    //                 let err = new Error(response.status);
    //                 err.response = response.json();
    //                 err.status = response.status;
    //                 throw err 
    //             }
    //             return response.json();
    //         }
    //     )
    //     .then(
    //         response => {
    //             let data = response.data;
    //             sessionStorage.setItem("jwt-token", data.access_token);
    //             window.location.replace("/profile");
    //         }
    //     )
    //     .catch((error) => alert(error.response.message));
    // });

})