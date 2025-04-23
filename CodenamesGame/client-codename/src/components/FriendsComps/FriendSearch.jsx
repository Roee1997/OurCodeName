import React, { useState } from "react";
import FriendAddRequest from "./FriendAddRequest";

const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setSearchResult(null);

    console.log("🔍 נשלחה בקשת חיפוש לשרת:", searchTerm);
    const endpoint = `http://localhost:5150/api/friends/search?query=${searchTerm.trim()}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("User not found");

      const user = await res.json();
      console.log("✅ משתמש נמצא:", user);
      setSearchResult(user);
    } catch (error) {
      console.error("❌ שגיאה בחיפוש:", error.message);
      setErrorMessage("המשתמש לא נמצא.");
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

      {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}

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
