window.addEventListener("load", async () => {
    // const profileForm = document.querySelector("#profile");
    const token = sessionStorage.getItem('jwt-token');
    const userText = document.querySelector("#user-name-title");
    const container_profile = document.querySelector(".loader-container");
    const processBar = document.querySelector(".progress-bar");
    const textProcess = document.querySelector(".text-loading");

    if (!token){
        alert("Mời bạn đang nhập lại hệ thống");
        window.location.replace("/");
    }
    container_profile.classList.remove("d-none");
    container_profile.classList.add("d-flex");
    progressBar(processBar, textProcess);      
})

function progressBar(elem, textProcess) {
    width = 0;
    elem.style.width = width +"%";
    textProcess.innerHTML = width +"%";
  
    id = setInterval(frame, 100);
  
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        var seconds_left = 5;
        document.querySelector(".loading-process").classList.remove('d-block');
        document.querySelector(".loading-process").classList.add('d-none');
        document.querySelector(".loading-done").classList.remove('d-none');
        document.querySelector(".loading-done").classList.add('d-block');
        var interval = setInterval(() => {
            

            document.querySelector('.time-loading').innerHTML = `(${--seconds_left})`;
            if (seconds_left <= 0)
            {
              clearInterval(interval);
            }
        }, 1000);
      } else {
        width++;
        elem.style.width = width +"%";
        textProcess.innerHTML = width +"%";
      }
    }
}
  