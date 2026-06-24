import axios, { AxiosError } from "axios";

export const authStorage = {
  getToken() {
    return localStorage.getItem("accessToken");
  },
  setToken(token: string) {
    localStorage.setItem("accessToken", token);
  },
  clear() {
    localStorage.removeItem("accessToken");
  },
};

const API_URL = import.meta.env.VITE_API_URL;

export const refreshAccessToken = async () => {
  const response = await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );

  const accessToken = response.data.data?.accessToken;
  if (!accessToken) throw new Error("No access token in refresh response");

  authStorage.setToken(accessToken);
  return accessToken;
};

const fetchMe = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data; 
};

export const bootstrapAuth = async () => {
  try {
    let token = authStorage.getToken();

    if (token) {
      try {
        const me = await fetchMe(token);
        return me; 
      } catch (err) {
        const e = err as AxiosError;
        if (e.response?.status !== 401) {
          throw err;
        }
      }
    }
    token = await refreshAccessToken();
    const me = await fetchMe(token as string);
    return me;
  } catch {
    return null;
  }
};
