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

export const deleteReservation = (id: string, email: string, token: string) => {
  return axios.delete(`${baseURL}/reservation`, {
    data: { reservationId: id, userEmail: email },
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const updateReservation = (data: any) => {
  return axios.patch(`${baseURL}/reservation`, data);
};


export const getNearest5Reservations = async (reservationId: string) => {
  const response = await axios.get(`${baseURL}/reservation/${reservationId}/nearest`);
  return response.data;
};
