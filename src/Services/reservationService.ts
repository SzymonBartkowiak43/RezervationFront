import axios from "axios";

const baseURL = "http://localhost:8080";


export const getUserReservations = async (email: string, token: string) => {
  const response = await axios.get(`${baseURL}/reservations`, {
    params: { email },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createReservation = (data: any) => {
  return axios.post(`${baseURL}/reservation`, data);
};

export const deleteReservation = (id: string) => {
  return axios.delete(`${baseURL}/reservation`, { data: { id } });
};

export const updateReservation = (data: any) => {
  return axios.patch(`${baseURL}/reservation`, data);
};
