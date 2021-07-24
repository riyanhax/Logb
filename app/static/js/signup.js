


const onSignUp = e => {
    e.preventDefault();

    payload = {
        number_phone: document.querySelector("#phone-signup").value,
        user_name: document.querySelector("#username-signup").value,
        password: document.querySelector("#password-signup").value
    }

    postData("api/user/register", payload)
    .then((response)=> {
        if (!response.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err 
        }
        alert("Đăng ký thành công! Mã phần mềm-nhận tại hotline/zalo 0889.629.555");
        renderLoginPage();
    })
    .catch((error) => {
        if ((error.status >= 400) || (error.status < 500)){
            const createAccountForm = document.querySelector("#createAccount");
            setFormMessage(createAccountForm, "error", "Đăng ký không thành công!");
            // alert(error.response.message);
        }
    });
}

const onValidNumber = e => {
    e.preventDefault();
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (!e.target.value.match(regex)){
        setInputError(e.target, "Số điện thoại không hợp lệ.")
    }
    else{
        clearInputError(e.target);
    }
}

const onConfirmPwd = e => {
    e.preventDefault();
    const pwd =  document.querySelector("#password-signup").value;

    if ((e.target.value != pwd) || (e.target.value.length < 8)){
        console.log(e.target.value);
        console.log(pwd);
        setInputError(e.target, "Xác nhận mật khẩu sai.")
    }
    else{
        clearInputError(e.target);
    }
}

const onValidPwdUserName = e => {
    e.preventDefault();
    if (e.target.value.length < 8){
        setInputError(e.target, "Tên đăng nhập và mật khẩu ít nhất có 8 kí tự")
    }
    else{
        clearInputError(e.target);
    }
}

function renderLoginPage(){
    const imgID = document.querySelector(".img-layout").dataset.id;
    window.location.replace(`/login/${imgID}`);
}

window.addEventListener("load", () => {
    const createAccountForm = document.querySelector("#createAccount");
    const inputPwdConfirm = document.querySelector("#confirm-pwd-signup");
    const inputPhoneNumber = document.querySelector("#phone-signup");
    const inputUserName = document.querySelector("#username-signup");
    const inputPwd = document.querySelector("#password-signup");

    createAccountForm.addEventListener("submit", onSignUp);
    inputPhoneNumber.addEventListener("change", onValidNumber);
    inputPwdConfirm.addEventListener("change", onConfirmPwd);
    inputUserName.addEventListener("change", onValidPwdUserName)
    inputPwd.addEventListener("change", onValidPwdUserName);

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        renderLoginPage();
    });
});
