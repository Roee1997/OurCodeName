const API_URL = "http://localhost:5150/api/friends";

export const searchUser = async (searchTerm) => {
  const response = await fetch(`${API_URL}/search?query=${searchTerm}`);
  if (response.status === 404) return null;
  return response.json();
};
