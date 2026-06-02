import { config } from "dotenv";
import db from "../../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const creategeminiClient=()=>{
// if(!process.env.GEMINI_API_KEY){
//     throw new Error("API_KEY is required in environment variables");
// }
// return new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// })
// }

async function main() {
  const response = await geminiClient.models.generateContent({
    model: GEMINI_MODEL,
    contents: "explain how AI works in simple terms",
  });
  // console.log(response.text);
}
main();

export const getRecentConversationRows = async (limit = 5) => {
  const normalizedLimit = Number.parseInt(limit, 10);
  const safeLimit =
    Number.isNaN(normalizedLimit) || normalizedLimit <= 0
      ? 20
      : normalizedLimit;
  const [rows] = await db.quiery(
    ` "SELECT * FROM conversations WHERE id = $1",
  [id] ORDER BY created_at DESC LIMIT ?`,
  );
  return rows.reverse();
};

const generateAssistantAnswer = async ({ historyRows, question }) => {
  //formatted history in google gen ai format
  const formattedHistory = historyRows?.map((row) => ({
    role: row.role === "assistant" ? "model" : "user",
    parts: [{ text: row.content }],
  }));

  const chat = geminiClient.chats.create({
    model: GEMINI_MODEL,
    history: formattedHistory,
    config: {
      maxOutputTokens: 512,
    },
  });

  const result = await chat.sendMessage({ message: question });
  console.log(result.text);
  return {
    text: result.text || "",
    totalTokenCount: result.usageMetadata?.totalTokenCount || 0,
  };
};

const getMessageById = async (messageID) => {
  const [rows] = await db.execute(
    "Select id, role, content, created_at from conversations where id=? Limit 1",
    [messageID],
  );
  if (!rows[0]) return null;

  return {
    id: rows[0].id,
    role: rows[0].role,
    content: rows[0].content,
    tokenCount: Number(rows[0].token_count || 0),
    created_at: rows[0].created_at,
  };
};
//************************************************************************** */
export async function createConversationService(question) {
  try {
    //validation
    if (!question.trim()) {
      const err = new Error("Question is required");
      err.status = 400;
      throw err;
    }

    //save to db

    await db.execute("INSERT INTO conversations (content) VALUES (?)", [
      question,
    ]);

    // Select recent conversation history:
    const historyRows = await getRecentConversationRows(5);

    //insert new conversation
    const [result] = await db.execute(
      "INSERT INTO conversations (content, role) VALUES (?, 'user')",
      [question],
    );

    const { text, totalTokenCount } = await generateAssistantAnswer({
      historyRows,
      question,
    });

    // saving the combined data to db
    const [createAssistantMessageResult] = await db.execute(
      "INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)",
      ["assistant", text, totalTokenCount],
    );

    //retrieve the saved conversation from db and send to client
    const userConversation = await getMessageById(result.insertId);
    const assistantConversation = await getMessageById(
      createAssistantMessageResult.insertId,
    );
    return {
      // historyRows,
      userConversation,
      assistantConversation,
    };
  } catch (err) {
    throw err;
  }
}
