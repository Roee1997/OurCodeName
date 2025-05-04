import React, { useState } from "react";
import FriendAddRequest from "./FriendAddRequest";
import { showToast } from "../../services/toastService";

const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    setSearchResult(null);

    const endpoint = `http://localhost:5150/api/friends/search?query=${searchTerm.trim()}`;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("User not found");

      const user = await res.json();
      setSearchResult(user);
      showToast("משתמש נמצא!", "success");
    } catch (error) {
      console.error("שגיאה בחיפוש:", error.message);
      showToast("המשתמש לא נמצא.", "error");
    }
  };

  return (
    <div className="mb-6" dir="rtl">
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="חפש לפי שם משתמש או אימייל"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          חיפוש
        </button>
      </div>

      {searchResult && (
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <span className="text-lg font-semibold">{searchResult.username}</span>
          <FriendAddRequest receiverUser={searchResult} />
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
