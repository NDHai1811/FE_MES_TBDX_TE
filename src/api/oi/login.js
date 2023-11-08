import axios from "axios";

export async function login(params) {
    const res = await axios.post('/login');
    return res;
}
export async function changePassword(params) {
    const res = await axios.post('/user/password/update', params);
    return res;
}