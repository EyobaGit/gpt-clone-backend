import express from 'express';
import { createConversationController, getConversationsController } from './controller/chat.controller.js';

const chatrouter = express.Router();

//api/chat/conversations
chatrouter.post("/conversations", createConversationController);

chatrouter.get("/conversations", getConversationsController );

export default chatrouter;