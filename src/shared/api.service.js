async function apiCall(path, method, data, getTokenSilently, loginWithRedirect) {
  let token = await getTokenSilently();
  const requestOptions = {
    method: method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  };
  if (method === 'POST') {
    requestOptions.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${path}`, requestOptions);
    return await response.json();
  } catch (e) {
    console.error(e);
    await loginWithRedirect();
  }
}

export async function createPoi(data, getTokenSilently, loginWithRedirect) {
  return apiCall('poi', 'POST', data, getTokenSilently, loginWithRedirect);
}

export async function getPois(getTokenSilently, loginWithRedirect) {
  return apiCall('poi', 'GET', null, getTokenSilently, loginWithRedirect);
}
