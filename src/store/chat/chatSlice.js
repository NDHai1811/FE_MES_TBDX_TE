// store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],          // danh sách các phòng chat
  activeChatId: null, // ID phòng đang mở
  activeChat: null, // phòng đang mở,
  messagesInActiveChat: [], // tin nhắn trong phòng đang mở
  filesInActiveChat: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setActiveChat(state, action) {
      state.activeChat = action.payload ?? null;
      state.activeChatId = action.payload?.id ?? null;
    },
    incrementUnread(state, action) {
      const chatId = action.payload.chat_id;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unread_count = (chat.unread_count || 0) + 1;
        chat.last_message = action.payload;

        // Đưa chat có tin nhắn mới lên đầu
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex > 0) {
          const [movedChat] = state.chats.splice(chatIndex, 1);
          state.chats.unshift(movedChat);
        }
      }
    },
    resetUnread(state, action) {
      const chatId = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) chat.unread_count = 0;
    },
    addMessage(state, action) {
      console.log(action.payload);
      
      state.messagesInActiveChat.push(action.payload);

      // Cập nhật last_message trong danh sách chat
      const chat = state.chats.find(c => c.id === action.payload.chat_id);
      if (chat) {
        chat.last_message = action.payload;

        // Đưa chat có tin nhắn mới lên đầu
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.chat_id);
        if (chatIndex > 0) {
          const [movedChat] = state.chats.splice(chatIndex, 1);
          state.chats.unshift(movedChat);
        }
      }
    },
    setMessagesInActiveChat(state, action) {
      state.messagesInActiveChat = action.payload;
    },
    recallMessage(state, action) {
      console.log('recallMessage', action.payload);
      state.messagesInActiveChat = state.messagesInActiveChat.map(m => m.id === action.payload.id ? action.payload : m);
      const { chat_id, id } = action.payload;
      const chat = state.chats.find(c => c.id === chat_id);
      if (!chat) return;

      // Đánh dấu message đã recall trong danh sách messages
      if (chat.last_message.id === id) {
        chat.last_message = action.payload;
        if (chat.unread_count > 0) {
          chat.unread_count -= 1;
        }
      } else {
        if (chat.last_read_message_id < id && chat.unread_count > 0) {
          chat.unread_count -= 1;
        }
      }
    },
    setFilesInActiveChat(state, action) {
      state.filesInActiveChat = action.payload;
    },
  }
});

export const {
  setChats,
  setActiveChat,
  incrementUnread,
  resetUnread,
  addMessage,
  setMessagesInActiveChat,
  recallMessage,
  setFilesInActiveChat,
} = chatSlice.actions;

export default chatSlice.reducer;
