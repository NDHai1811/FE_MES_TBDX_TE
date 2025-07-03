import axios from "axios";

export async function getChatList(params) {
    const res = await axios.get("/chats", params);
    return res;
}
export async function createChat(params) {
    const res = await axios.post("/chats", params);
    return res;
}
export async function updateChat(params, chatId) {
    if (!chatId) {
        return;
    }
    const res = await axios.patch("/chats/" + chatId, params);
    return res;
}
export async function sendMessage(params, chatId) {
    if (!chatId) {
        return;
    }
    const res = await axios.post("/chats/" + chatId + "/messages", params, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res;
}
export async function markAsRead(params, chatId) {
    const res = await axios.post("/chats/" + chatId + "/read", params);
    return res;
}
export async function uploadFiles(params, chatId) {
    if (!chatId) {
        return;
    }
    const res = await axios.post("/chats/" + chatId + "/files", params, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res;
}
export async function getMessages(params) {
    if (!params?.chat_id) {
        return;
    }
    const res = await axios.get("/chats/" + params.chat_id + "/messages", { params });
    return res;
}
export async function downloadFileMsg(url) {
    const res = await axios.get(url, { responseType: 'blob' });
    return res;
}
export async function getFiles(params, chatId) {
    if (!chatId) {
        return;
    }
    const res = await axios.get('/files/' + chatId, { params });
    return res;
}