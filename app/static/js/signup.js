document.addEventListener("DOMContentLoaded", () => {
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        
        window.location.replace("/login")
    });

    createAccountForm.addEventListener("submit", e => {
    e.preventDefault();
    
    let email = document.getElementById("email-signup").value;
    let pwd1 = document.getElementById("password1-signup").value;
    let pwd2 = document.getElementById("password2-signup").value;
    let name = document.getElementById("username-signup").value;

    if (( pwd1.length < 8) || (pwd2.length < 8) || (name.length < 8)){
        alert("Password or Username must be at least 8 characters in length");
        return;
    }
    
    let payload = {
        email: email, 
        password1: pwd1,
        password2: pwd2,
        user_name: name,
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

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if ((e.target.id === "password1-signup" || e.target.id === "password1-signup") && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Password must be at least 8 characters in length");
            }

            if (e.target.id === "username-signup" && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Username must be at least 8 characters in length");
            }

        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
