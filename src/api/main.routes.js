import express from 'express';
import chatrouter from './chat/chat.routes.js';
const mainRouter = express.Router();

// mainRouter.use("/chat", chatrouter => { 
//   res.send("Hello chatpage!");
// })
mainRouter.use("/chat",chatrouter)


export default mainRouter;