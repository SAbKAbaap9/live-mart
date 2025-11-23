const BASE_URL = "http://localhost:8080/api"; // Change to your backend URL

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("authToken");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData
    });
    
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};