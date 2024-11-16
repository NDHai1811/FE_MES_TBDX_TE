import axios from "axios";

export async function getVOCTypes() {
  return await axios.get("/voc-types");
}

export async function getVOC(params) {
  return await axios.get("/voc", { params });
}

export async function createVOC(params) {
  return await axios.post("/voc", params);
}

export async function updateVOC(params, id) {
  return await axios.put(`/voc/${id}`, params);
}

export async function deleteVOC(id) {
  return await axios.delete(`/voc/${id}`);
}

export async function uploadFileVOC(params) {
  const res = await axios.post('/voc/upload-file', params, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
}
