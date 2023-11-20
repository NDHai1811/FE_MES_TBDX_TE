import axios from "axios";

export async function login(params) {
  return await axios.post("/login");
}
export async function changePassword(params) {
  return await axios.post("/user/password/update", params);
}
