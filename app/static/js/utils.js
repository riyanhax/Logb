var baseUrl = "http://192.168.1.8:5000/"

async function postData(url = '', data = {}) {
    // Default options are marked with *
    url = baseUrl+url;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json();
}

// function get(url, successCallback, async = true) {
//     $.ajax({
//         url: baseUrl + url,
//         type: "GET",
//         async,
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         success: function (res) {
//             if (res.status == "success") {
//                 successCallback && successCallback(res.data);
//             } else {
//                 showAlert(res.message);
//             }
//         },
//         failure: function (err) {
//             showAlert(err);
//         },
//         error: function (xhr, textStatus, thrownError) {
//             showAlert(thrownError || textStatus);
//         }
//     });
// }