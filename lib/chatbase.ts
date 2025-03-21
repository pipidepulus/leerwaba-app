// lib/chatbase.ts
import crypto from "crypto";
import pool from './db';
import { sendNewMessageNotification } from "./email";

export interface ChatbaseMessage {
  role: string;
  content: string;
}

export interface ChatbaseConversation {
  id: string;
  created_at: string;
  messages: ChatbaseMessage[];
  chatbot_id: string;
  customer: string;
  source: string;
}

export interface ChatbaseResponse {
  data: ChatbaseConversation[];
}

// Función para generar el hash del ID del usuario
function generateUserHash(userId: string, secretKey: string): string {
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(userId)
    .digest("hex");
  return hash;
}

export async function getChatbaseConversations(
  userId: string, // Añadimos el userId como parámetro
  startDate?: string,
  endDate?: string,
  page?: string,
  size?: string,
  filteredSources?: string
): Promise<ChatbaseResponse> {
  const chatbotId = process.env.CHATBASE_CHATBOT_ID;
  const secretKey = process.env.CHATBASE_SECRET_KEY;

  if (!chatbotId || !secretKey) {
    throw new Error(
      "CHATBASE_CHATBOT_ID or CHATBASE_SECRET_KEY environment variables are not set."
    );
  }

  if (!userId) {
    throw new Error("userId is required.");
  }

  const url = new URL("https://www.chatbase.co/api/v1/get-conversations");
  url.searchParams.append("chatbotId", chatbotId);

  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (page) {
    url.searchParams.append("page", page);
  }
  if (size) {
    url.searchParams.append("size", size);
  }
  if (filteredSources) {
    url.searchParams.append("filteredSources", filteredSources);
  }

  // Generamos el hash del usuario
  const userHash = generateUserHash(userId, secretKey);

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${secretKey}`,
    "X-User-Hash": userHash, // Añadimos el hash a la cabecera
  };

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching Chatbase conversations:", errorData);
    throw new Error(
      `Error fetching Chatbase conversations: ${response.statusText}`
    );
  }

  const data: ChatbaseResponse = await response.json();
  return data;
}

const processedConversationIds: Set<string> = new Set();

export async function saveChatbaseConversations(conversations: ChatbaseConversation[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const conversation of conversations) {
      // Check if the conversation has already been processed
      if (processedConversationIds.has(conversation.id)) {
        console.log(`Skipping duplicate conversation: ${conversation.id}`);
        continue; // Skip to the next conversation
      }

      await sendNewMessageNotification("user@example.com", conversation.id);

      // Add the conversation ID to the set of processed IDs
      processedConversationIds.add(conversation.id);

      const conversationQuery = `
        INSERT INTO conversations (id, created_at, chatbot_id, customer, source)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;
      const conversationValues = [
        conversation.id,
        conversation.created_at,
        conversation.chatbot_id,
        conversation.customer,
        conversation.source,
      ];
      const conversationResult = await client.query(conversationQuery, conversationValues);
      const conversationId = conversationResult.rows[0].id;

      for (const message of conversation.messages) {
        const messageQuery = `
          INSERT INTO messages (conversation_id, role, content)
          VALUES ($1, $2, $3)
        `;
        const messageValues = [conversationId, message.role, message.content];
        await client.query(messageQuery, messageValues);
      }
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
