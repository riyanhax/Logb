window.addEventListener("load", () => {
    const btnLogin = document.querySelector(".btn-login__admin");
    btnLogin.addEventListener("click", onSignIn);
})

const onSignIn = e => {
    let payload = {
        user_name: document.getElementById("username-login__admin").value,
        password: document.getElementById("password-login__admin").value,
    }

    postData("/auth/admin", payload)
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
            window.sessionStorage.setItem("jwt-token-admin", res.data.access_token);
            window.location.replace("/bennbeckman_page")
        }
    )
    .catch(error => 
        {
            const Form = document.querySelector("#admin-login");
            setFormMessage(Form, "error", "Tài khoản hoặc mật khẩu không đúng.")
        })
}