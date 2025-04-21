import React, { useState } from "react";
import FriendAddRequest from "./FriendAddRequest";

const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setSearchResult(null);

    console.log("🔍 Query sent to server:", searchTerm);
    const endpoint = `http://localhost:5150/api/friends/search?query=${searchTerm.trim()}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("User not found");

      const user = await res.json();
      console.log("✅ User found:", user);
      setSearchResult(user);
    } catch (error) {
      console.error("❌ Search error:", error.message);
      setErrorMessage("User not found.");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}

      {searchResult && (
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <span className="text-lg font-semibold">{searchResult.username}</span>
          <FriendAddRequest receiverQuery={searchResult.username} />
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
