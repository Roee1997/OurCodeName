import React, { useState } from "react";
import { searchUser, sendFriendRequest } from "../services/friendsService";

const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setSearchResult(null);

    if (!searchTerm.trim()) {
      setErrorMessage("Please enter a username or user ID.");
      return;
    }

    try {
      const user = await searchUser(searchTerm.trim());
      if (user) {
        setSearchResult(user);
      } else {
        setErrorMessage("User not found.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Error occurred while searching.");
    }
  };

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(searchResult.UserID);
      setSuccessMessage("Friend request sent!");
      setSearchResult(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Send request error:", error);
      setErrorMessage("Failed to send friend request.");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search by username or ID"
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
      {successMessage && <p className="text-green-500 mt-1">{successMessage}</p>}

      {searchResult && (
        <div className="bg-gray-100 p-4 rounded shadow-md mt-3 flex justify-between items-center">
          <span>{searchResult.Username} (ID: {searchResult.UserID})</span>
          <button
            onClick={handleSendRequest}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
