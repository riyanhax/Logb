document.addEventListener("DOMContentLoaded", async () => {
    const profileForm = document.querySelector("#profile");
    const token = sessionStorage.getItem('jwt-token');
    const userText = document.querySelector("#user-name-title")

    const headers = { 'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'};

    // await getData("api/user/me", headers)
    // .then(response => {
    //     if (!response.ok){
    //         let err = new Error(response.status)
    //         err.response = response.json()
    //         err.status = response.status
    //         throw err
    //     }
    //     return response.json()
    // })
    // .then(response => {
    //     let user = response.data;
    //     userText.innerHTML = "Welcome, " + user.user_name + "!"
    // })
    // .catch((error) => {
    //     userText.innerHTML = "Welcome"
    // })

    profileForm.addEventListener("submit", e => {
        e.preventDefault();

        deleteData("/auth/logout")
        .then(response => {
            if (!response.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err
            }
            localStorage.removeItem("jwt-token");
            window.location.replace("/login");
        })
        .catch(error => console.error(error));
    });
})