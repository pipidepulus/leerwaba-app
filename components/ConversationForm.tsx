// components/ConversationForm.tsx
"use client";
import { useState } from "react";

interface ConversationFormProps {
  onSubmit: (
    userId: string,
    startDate?: string,
    endDate?: string,
    page?: string,
    size?: string,
    filteredSources?: string
  ) => void;
}

export default function ConversationForm({ onSubmit }: ConversationFormProps) {
  const [userId, setUserId] = useState("test-user-123");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState("1");
  const [size, setSize] = useState("10");
  const [filteredSources, setFilteredSources] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(userId, startDate, endDate, page, size, filteredSources);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="text"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="text"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="page">Page:</label>
        <input
          type="text"
          id="page"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="size">Size:</label>
        <input
          type="text"
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="filteredSources">Filtered Sources:</label>
        <input
          type="text"
          id="filteredSources"
          value={filteredSources}
          onChange={(e) => setFilteredSources(e.target.value)}
        />
      </div>
      <div>
    <label htmlFor="page">Page:</label>
    <input
      type="number"
      id="page"
      value={page}
      onChange={(e) => setPage(e.target.value)}
    />
  </div>
  <div>
    <label htmlFor="size">Size:</label>
    <input
      type="number"
      id="size"
      value={size}
      onChange={(e) => setSize(e.target.value)}
    />
  </div>
      <button type="submit">Search</button>
    </form>
  );
}
