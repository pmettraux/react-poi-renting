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

  // for the price we will check if we have a category named `price_${data.price}`
  // if not we will create it and assign it to the poi
  let categoryPrice = await findCategoryByName(`price_${data.price}`, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!categoryPrice) {
    const createdCategory = await createCategory(`price_${data.price}`, getTokenSilently, loginWithRedirect);
    categoryPrice = createdCategory.data;
  }

  // remove price for the poi call
  delete data.price;

  const poi = await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/poi`,
      data,
      { headers: headers }
    ),
    loginWithRedirect);

  return await attachCategoriesToPoi([categoryPrice.id], poi.data.id, getTokenSilently, loginWithRedirect);
}

export async function attachCategoriesToPoi(categoriesId, poiId, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.patch(`${process.env.REACT_APP_SERVER_URL}/poi/${poiId}/category/`,
      categoriesId, 
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

export async function createCategory(name, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/category`,
      { name },
      { headers: headers }
    ),
    loginWithRedirect);
}

export async function findCategoryByName(categoryName, getTokenSilently, loginWithRedirect) {
  const categories = await getCategories(getTokenSilently, loginWithRedirect);

  for(let i = 0; i < categories.data.length; i++) {
    if (categories.data[i].name === categoryName) {
      return categories.data[i];
    }
  }
  return false;
}
