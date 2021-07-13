async function postData(url = '', data = {}) {
    // Default options are marked with *
    // url = baseUrl+url;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response;
}

async function getData(url = '', headers = {'Content-Type': 'application/json'}) {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return response;
}

async function deleteData(url = '', headers = {'Content-Type': 'application/json'}) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  return response;
}
// async function postData(url = '', data = {}) {
//   // Default options are marked with *
//   // url = baseUrl+url;
//   const response = await fetch(url, {
//     method: 'GET',
//     mode: 'cors',
//     cache: 'no-cache',
//     credentials: 'same-origin',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     redirect: 'follow',
//     referrerPolicy: 'no-referrer', 
//     body: JSON.stringify(data) 
//   });
//   return response;
// }
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