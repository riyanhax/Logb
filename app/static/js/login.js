const onSignUp = e => {
    e.preventDefault();
    const imgID = document.querySelector(".img-layout").dataset.id;
    window.location.href = `/signup/${imgID}`;
}

const onSignIn = e => {
    e.preventDefault();
    let payload = {
        user_name: document.getElementById("username-login").value,
        password: document.getElementById("password-login").value,
        code: document.getElementById("input-verify").value,
        imgID: document.querySelector(".img-layout").dataset.id
    }
    const loginForm = document.querySelector("#login");
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
        (res) => {
            window.sessionStorage.setItem("jwt-token", res.data.access_token);
            window.location.replace("/profile")
        }

    )
    .catch(error => setFormMessage(loginForm, "error", "Tài khoản hoặc mật khẩu không đúng."))
}

const onValidPwdUserName = e => {
    e.preventDefault();
    if (e.target.value.length < 8){
        let loginForm = document.querySelector("#login");
        setInputError(loginForm, "Tên đăng nhập và mật khẩu ít nhất có 8 kí tự")
    }
    else{
        clearInputError(e.target);
    }
}

const onEnterPress = e => {
    if (e.keyCode === 13) {
        onSignIn(e);
    }
}

window.addEventListener("load", () => {
    const btnLogin = document.querySelector(".btn-login");
    const loginForm = document.querySelector("#login");
    const inputPwd = document.querySelector("#password-login");
    const inputUserName = document.querySelector("#username-login");
    const btnSignup = document.querySelector(".btn-signup");

    btnSignup.addEventListener("click", onSignUp);
    btnLogin.addEventListener("click", onSignIn);
    loginForm.addEventListener("keyup", onEnterPress);
    inputPwd.addEventListener("change", onValidPwdUserName);
    inputUserName.addEventListener("change", onValidPwdUserName);
})