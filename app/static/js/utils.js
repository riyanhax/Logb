
var baseUrl = ""
async function postData(url = '', data = {}) {
    // Default options are marked with *
    url = baseUrl + url;
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
  url = baseUrl + url;
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return response;
}

async function deleteData(url = '', data = {}, headers = {'Content-Type': 'application/json'}) {
  url = baseUrl + url;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify(data) 
  });
  return response;
}

async function updateData(url = '', data = {}, headers = {'Content-Type': 'application/json'}) {
  url = baseUrl + url;
  const response = await fetch(url, {
    method: 'UPDATE',
    headers: headers,
    body: JSON.stringify(data) 
  });
  return response;
}

async function initSearchEngine(data, keys, setOptions=null) {
  let defaultOptions = {
      threshold: 0.1,
      distance: 1000,
      ignoreLocation: true
  }
  let options = $.extend(defaultOptions, setOptions);
  let searchEngine = await new Fuse(
      data, {
          keys: keys,
          distance: options.distance,
          threshold: options.threshold,
          ignoreLocation: options.ignoreLocation
      }
  );
  return searchEngine;
}