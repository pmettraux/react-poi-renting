import axios from 'axios';

async function getHeaders(getTokenSilently) {
  let token = await getTokenSilently();

  return {
    'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
  }
}

async function apiCall(callFunc, loginWithRedirect) {
  try{
    return await callFunc;
  } catch(e) {
    console.error('apiCall error', e);
    loginWithRedirect();
  }

}

export async function createPoi(data, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/poi`,
      data,
      { headers: headers }
    ),
    loginWithRedirect);
}

export async function deletePoi(key, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/poi/${key}`,
      { headers: headers }
    ),
    loginWithRedirect);
}

export async function getPois(getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/poi`,
      { headers: headers }
    ),
    loginWithRedirect);
}

export async function getCategories(getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/category`,
      { headers: headers }
    ),
    loginWithRedirect);
}
