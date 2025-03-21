import React, { useState } from "react";
import { searchUser } from "../services/friendsService";

const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const user = await searchUser(searchTerm);
      if (user) {
        setSearchResult(user);
        setErrorMessage("");
      } else {
        setSearchResult(null);
        setErrorMessage("User not found.");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setErrorMessage("Error occurred while searching.");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search user by ID or username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Search
      </button>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {searchResult && (
        <div className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center mt-2">
          <span>{searchResult.Username} (ID: {searchResult.UserID})</span>
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
