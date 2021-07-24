window.addEventListener('load', (event) => {
    const btnList = document.querySelectorAll(".img-btn");
    btnList.forEach(btn => btn.addEventListener("click", renderLoginPage))
});

function renderLoginPage(e){
    e.preventDefault();
    const dataID = e.target.getAttribute("data-id");
    window.location.href = `/login/${dataID}`;
}