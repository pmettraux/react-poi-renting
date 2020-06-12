import axios from 'axios';

async function getHeaders(getTokenSilently) {
  let token = await getTokenSilently();

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function getImageHeaders(getTokenSilently) {
  let token = await getTokenSilently();

  return {
    'Access-Control-Allow-Origin': '*', 
    Authorization: `Bearer ${token}`,
  }
}

async function getFileHeaders(getTokenSilently) {
  let token = await getTokenSilently();

  return {
    'Content-Type': 'multipart/form-data',
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

export async function fileToImage(filePath, getTokenSilently, loginWithRedirect) {
  let headers = await getImageHeaders(getTokenSilently);

  const imageData = await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/file/download/${filePath}`,
      { 
        headers: headers, 
        responseType: 'arraybuffer'
      }
    ),
    loginWithRedirect)
    
  return Buffer.from(imageData.data, 'binary').toString('base64');
}


export async function uploadFile(file, getTokenSilently, loginWithRedirect) {
  let headers = await getFileHeaders(getTokenSilently);

  return await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/file`,
      file,
      { headers: headers }
    ),
    loginWithRedirect)
}

async function getStatusAvailability(currentlyAvailable, getTokenSilently, loginWithRedirect) {
  let statusName = currentlyAvailable ? 'status_available' : 'status_unavailable';
  // for the status we will check if we have a status named according to the value of statusName
  // if not we will create it and assign it to the poi
  let status = await findStatusByName(statusName, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!status) {
    const createdStatus = await createStatus(statusName, getTokenSilently, loginWithRedirect);
    status = createdStatus.data;
  }
  return status;
}

async function getOrCreateCategory(categoryName, getTokenSilently, loginWithRedirect) {
  // for the price we will check if we have a category named in the variable categoryName
  // if not we will create it and assign it to the poi
  let category = await findCategoryByName(categoryName, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!category) {
    const createdCategory = await createCategory(categoryName, getTokenSilently, loginWithRedirect);
    category = createdCategory.data;
  }
  return category;
}

export async function createPoi(data, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  let createdGpxFile;
  if (data.gpxFile){
    let formData = new FormData();
    formData.append('file', data.gpxFile); 
    createdGpxFile = await uploadFile(formData, getTokenSilently, loginWithRedirect);
    createdGpxFile = createdGpxFile.data
  }

  data.image = [];
  for (let i = 0; i < data.images.length; i++) {
    let formData = new FormData();
    formData.append('file', data.images[i]); 
    const image = await uploadFile(formData, getTokenSilently, loginWithRedirect);
    data.image.push(image.data.id);
  }
  data.image = data.image.join(';');

  const status = await getStatusAvailability(data.currentlyAvailable, getTokenSilently, loginWithRedirect);

  const categoryPrice = await getOrCreateCategory(`price_${data.price}`, getTokenSilently, loginWithRedirect);
  const categoryHomeType = await getOrCreateCategory(`homeType_${data.homeType}`, getTokenSilently, loginWithRedirect);
  const categoryShareType = await getOrCreateCategory(`shareType_${data.shareType}`, getTokenSilently, loginWithRedirect);

  // remove categories/status/images for the poi call
  delete data.price;
  delete data.homeType;
  delete data.shareType;
  delete data.images;
  delete data.currentlyAvailable;

  const poi = await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/poi`,
      data,
      { headers: headers }
    ),
    loginWithRedirect);

  if (data.gpxFile){
    await attachFileToPoi(createdGpxFile.id, poi.data.id, getTokenSilently, loginWithRedirect);
  }

  return await Promise.all([
    await attachCategoriesToPoi([
      categoryPrice.id,
      categoryHomeType.id,
      categoryShareType.id,
    ], poi.data.id, getTokenSilently, loginWithRedirect),
    await attachStatusToPoi(
      status.id,
      poi.data.id, getTokenSilently, loginWithRedirect),
  ]);
}


export async function attachFileToPoi(gpxFileId, poiId, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
      axios.patch(`${process.env.REACT_APP_SERVER_URL}/poi/${poiId}/file/`,
      gpxFileId, 
      { headers: headers }
    ),
    loginWithRedirect);
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

export async function attachStatusToPoi(statusId, poiId, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
      axios.patch(`${process.env.REACT_APP_SERVER_URL}/poi/${poiId}/status/`,
      statusId, 
      { headers: headers }
    ),
    loginWithRedirect);
}

export async function toggleAvailability(currentlyAvailable, poiId, getTokenSilently, loginWithRedirect) {
  const status = await getStatusAvailability(!currentlyAvailable, getTokenSilently, loginWithRedirect);
  return await attachStatusToPoi(status.id, poiId, getTokenSilently, loginWithRedirect);
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

export async function getFile(fileId, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/file/${fileId}`,
      { headers: headers }
    ),
    loginWithRedirect
  );
}

export async function getCategories(getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/category`,
      { headers: headers }
    ),
    loginWithRedirect);
}

async function getStatuses(getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.get(`${process.env.REACT_APP_SERVER_URL}/status`,
      { headers: headers }
    ),
    loginWithRedirect);
}

async function createCategory(name, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/category`,
      { name },
      { headers: headers }
    ),
    loginWithRedirect);
}

async function createStatus(name, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);

  return await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/status`,
      { name },
      { headers: headers }
    ),
    loginWithRedirect);
}

async function findCategoryByName(categoryName, getTokenSilently, loginWithRedirect) {
  const categories = await getCategories(getTokenSilently, loginWithRedirect);

  for(let i = 0; i < categories.data.length; i++) {
    if (categories.data[i].name === categoryName) {
      return categories.data[i];
    }
  }
  return false;
}

async function findStatusByName(statusName, getTokenSilently, loginWithRedirect) {
  const statuses = await getStatuses(getTokenSilently, loginWithRedirect);

  for(let i = 0; i < statuses.data.length; i++) {
    if (statuses.data[i].name === statusName) {
      return statuses.data[i];
    }
  }
  return false;
}
