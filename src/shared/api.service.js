import axios from 'axios';

async function getHeaders(getTokenSilently) {
  let token = await getTokenSilently();

  return {
    'Content-Type': 'application/json',
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
   // loginWithRedirect();
  }
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

export async function createPoi(data, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);


  let createdGpxFile;
  if (data.gpxFile){
    let formData = new FormData();
    formData.append('file', data.gpxFile); 
    createdGpxFile = await uploadFile(formData, getTokenSilently, loginWithRedirect);
    createdGpxFile = createdGpxFile.data
  }


  data.image = ''
  if (data.images.length > 0){
    for (let i = 0; i < data.images.length; i++) {
      let formData = new FormData();
      formData.append('file', data.images[i]); 
      const image = await uploadFile(formData, getTokenSilently, loginWithRedirect);
      data.image = data.image.concat(image.data.id + ';')
    }
  }

  // for the price we will check if we have a category named `price_${data.price}`
  // if not we will create it and assign it to the poi
  let categoryPrice = await findCategoryByName(`price_${data.price}`, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!categoryPrice) {
    const createdCategoryPrice = await createCategory(`price_${data.price}`, getTokenSilently, loginWithRedirect);
    categoryPrice = createdCategoryPrice.data;
  }

  // for the homeType we will check if we have a category named `homeType_${data.homeType}`
  // if not we will create it and assign it to the poi
  let categoryHomeType = await findCategoryByName(`homeType_${data.homeType}`, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!categoryHomeType) {
    const createdCategoryHomeType = await createCategory(`homeType_${data.homeType}`, getTokenSilently, loginWithRedirect);
    categoryHomeType = createdCategoryHomeType.data;
  }

  // for the homeType we will check if we have a category named `shareType_${data.homeType}`
  // if not we will create it and assign it to the poi
  let categoryShareType = await findCategoryByName(`shareType_${data.shareType}`, getTokenSilently, loginWithRedirect);
  // if the category does not exist we crate it
  if (!categoryShareType) {
    const createdCategoryShareType = await createCategory(`shareType_${data.shareType}`, getTokenSilently, loginWithRedirect);
    categoryShareType = createdCategoryShareType.data;
  }

  // remove categories for the poi call
  delete data.price;
  delete data.homeType;
  delete data.shareType;

  const poi = await apiCall(
    axios.post(`${process.env.REACT_APP_SERVER_URL}/poi`,
      data,
      { headers: headers }
    ),
    loginWithRedirect);


  await attachFileToPoi(createdGpxFile.id, poi.data.id, getTokenSilently, loginWithRedirect)

  return await attachCategoriesToPoi([
    categoryPrice.id,
    categoryHomeType.id,
    categoryShareType.id,
  ], poi.data.id, getTokenSilently, loginWithRedirect);
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

export async function getPoiFiles(fileIds, getTokenSilently, loginWithRedirect) {
  let headers = await getHeaders(getTokenSilently);
  let imageUrls = [];

  fileIds = fileIds ? fileIds.split(';') : [];

  fileIds.forEach(async(id) => {
    if (!isNaN(id) && id !== ''){

      imageUrls.push(await apiCall(
        axios.get(`${process.env.REACT_APP_SERVER_URL}/file/${id}`,
          { headers: headers }
      ),
      loginWithRedirect))     
    }
  });
  
  return imageUrls;
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
