import axios from "axios";

export async function login(params) {
    const res = await axios.post('/login');
    return res;
}