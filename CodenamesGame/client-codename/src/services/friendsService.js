export const searchUser = async (query) => {
  const res = await fetch(`/api/users/search?query=${query}`);
  if (!res.ok) return null;
  return res.json();
};

export const sendFriendRequest = async (receiverId) => {
  const res = await fetch("/api/friends/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId }),
  });
  if (!res.ok) throw new Error("Failed to send request");
};
