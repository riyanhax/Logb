async function postData(url = '', data = {}) {
    // Default options are marked with *
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


