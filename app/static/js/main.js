
var bntSignUp = document.getElementById("btn-signup");

bntSignUp.onclick = async(e)=>{
    e.preventDefault();
    // let email = document.getElementById("email-signup").value;
    // let firstname = document.getElementById("firstname-signup").value;
    // let lastname = document.getElementById("lastname-signup").value;
    // let password1 = document.getElementById("password1-signup").value;
    // let password2 = document.getElementById("password2-signup").value;

    payload = {
        email: document.getElementById("email-signup").value,
        first_name: document.getElementById("firstname-signup").value,
        last_name: document.getElementById("lastname-signup").value,
        password1: document.getElementById("password1-signup").value,
        password2: document.getElementById("password2-signup").value,
        user_name: document.getElementById("username-signup").value,
    }

    postData("api/user/register", payload)
    .then(()=> {window.location.replace("/profile")})
    .catch((error) => {
        console.log('Error:', error);
      });
}

function myFunction(){
    
}
