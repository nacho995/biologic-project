import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('csv', file);
  const response = await api.post('/upload/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  const response = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getImage = async (id) => {
  const response = await api.get(`/images/${id}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getThumbnail = async (id) => {
  const response = await api.get(`/images/${id}/thumbnail`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
};

export const adjustImageColor = async (id, adjustments) => {
  const response = await api.post(
    `/images/${id}/color-adjust`,
    { adjustments },
    { responseType: 'blob' }
  );
  return response.data;
};

export const getImageSlice = async (id, axis, index) => {
  const response = await api.get(`/images/${id}/slices`, {
    params: { axis, index },
    responseType: 'blob',
  });
  return response.data;
};

export const getMetadata = async (imageId) => {
  const response = await api.get(`/metadata/${imageId}`);
  return response.data;
};

export const getAllMetadata = async (filter) => {
  const params = filter ? { filter: JSON.stringify(filter) } : {};
  const response = await api.get('/metadata', { params });
  return response.data;
};

// CSV Uploads Management
export const getAllCsvUploads = async (params = {}) => {
  const response = await api.get('/csv-uploads', { params });
  return response.data;
};

export const getCsvUploadById = async (id) => {
  const response = await api.get(`/csv-uploads/${id}`);
  return response.data;
};

export const updateCsvUpload = async (id, data) => {
  const response = await api.put(`/csv-uploads/${id}`, data);
  return response.data;
};

export const deleteCsvUpload = async (id) => {
  const response = await api.delete(`/csv-uploads/${id}`);
  return response.data;
};

// Images Management
export const getAllImages = async (params = {}) => {
  const response = await api.get('/images', { params });
  return response.data;
};

export const getImageDetails = async (id) => {
  const response = await api.get(`/images/${id}/details`);
  return response.data;
};

export const getImagesByCsv = async (csvId) => {
  const response = await api.get(`/images/by-csv/${csvId}`);
  return response.data;
};

export const updateImage = async (id, data) => {
  const response = await api.put(`/images/${id}`, data);
  return response.data;
};

export const deleteImage = async (id) => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};

// Compositions
export const createComposition = async (data) => {
  const response = await api.post('/compositions', data);
  return response.data;
};

export const getAllCompositions = async (params = {}) => {
  const response = await api.get('/compositions', { params });
  return response.data;
};

export const getCompositionById = async (id) => {
  const response = await api.get(`/compositions/${id}`);
  return response.data;
};

export const updateComposition = async (id, data) => {
  const response = await api.put(`/compositions/${id}`, data);
  return response.data;
};

export const deleteComposition = async (id) => {
  const response = await api.delete(`/compositions/${id}`);
  return response.data;
};

// Quantitative Analysis
export const getQuantitativeAnalysis = async (imageId) => {
  const response = await api.get(`/images/${imageId}/quantitative-analysis`);
  return response.data;
};

export const performCellSegmentation = async (imageId, options = {}) => {
  const response = await api.post(`/images/${imageId}/segment`, options);
  return response.data;
};

// Export Scientific Formats
export const exportToOMETIFF = async (imageId, options = {}) => {
  const response = await api.post(`/images/${imageId}/export/ome-tiff`, options, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportToHDF5 = async (imageId, options = {}) => {
  const response = await api.post(`/images/${imageId}/export/hdf5`, options, {
    responseType: 'blob',
  });
  return response.data;
};

// ML Segmentation
export const getAvailableMLModels = async () => {
  const response = await api.get('/ml/models');
  return response.data;
};

export const segmentCells = async (imageId, modelType = 'cellpose', options = {}) => {
  const response = await api.post(
    `/ml/segment/${imageId}`,
    { modelType, options },
    { responseType: 'blob' }
  );
  return response.data;
};

export const getSegmentationMetrics = async (imageId, modelType = 'cellpose', options = {}) => {
  const response = await api.get(`/ml/segment/${imageId}/metrics`, {
    params: { modelType, ...options }
  });
  return response.data;
};

