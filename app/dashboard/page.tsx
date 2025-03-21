// app/dashboard/page.tsx
"use client";

import ConversationList from "@/components/ConversationList";
import ConversationForm from "@/components/ConversationForm";
import { getChatbaseConversations, ChatbaseConversation } from "@/lib/chatbase";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") || "test-user-123";
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const size = searchParams.get("size") ?? undefined;
  const filteredSources = searchParams.get("filteredSources") ?? undefined;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [conversations, setConversations] = useState<ChatbaseConversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getConversations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getChatbaseConversations(
          userId,
          startDate,
          endDate,
          page,
          size,
          filteredSources
        );
        setConversations(data.data);
        // Calculate total pages (this is a simplified example)
        setTotalPages(Math.ceil(100 / Number(size)));

      } catch (error) {
        console.error("Error in DashboardPage:", error);
        setError("Failed to load conversations.");
      } finally {
        setIsLoading(false);
      }
    };

    getConversations();
  }, [userId, startDate, endDate, page, size, filteredSources]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.location.href = `/dashboard?userId=${userId}&startDate=${startDate}&endDate=${endDate}&page=${newPage}&size=${size}&filteredSources=${filteredSources}`;
  };

  return (
    <div>
      <h1>Chatbase Conversations Dashboard</h1>
      <ConversationForm
        onSubmit={async (
          userId,
          startDate,
          endDate,
          page,
          size,
          filteredSources
        ) => {
          window.location.href = `/dashboard?userId=${userId}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}&filteredSources=${filteredSources}`;
        }}
      />
      {isLoading && <p>Loading conversations...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && <ConversationList conversations={conversations} />}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
