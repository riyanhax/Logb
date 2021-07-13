document.addEventListener("DOMContentLoaded", () => {
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        
        window.location.replace("/login")
    });

    createAccountForm.addEventListener("submit", e => {
    e.preventDefault();
    let payload = {
        email: document.getElementById("email-signup").value,
        password1: document.getElementById("password1-signup").value,
        password2: document.getElementById("password2-signup").value,
        user_name: document.getElementById("username-signup").value,
    }

    postData("api/user/register", payload)
    .then((response)=> {
        if (!response.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err 
        }
        alert("register success");
        window.location.replace("/login")
    })
    .catch((error) => {
        alert(error.response.message);
    });
    })
});
