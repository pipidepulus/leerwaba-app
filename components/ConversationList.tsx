// components/ConversationList.tsx
import { ChatbaseConversation } from "@/lib/chatbase";

interface ConversationListProps {
  conversations: ChatbaseConversation[];
}

export default function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <h3>Conversation ID: {conversation.id}</h3>
            <p>Created At: {conversation.created_at}</p>
            <p>Customer: {conversation.customer}</p>
            <p>Source: {conversation.source}</p>
            <h4>Messages:</h4>
            <ul>
              {conversation.messages.map((message, index) => (
                <li key={index}>
                  <strong>{message.role}:</strong> {message.content}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
