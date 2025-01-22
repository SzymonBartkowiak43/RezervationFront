import axios from "axios";

const baseURL = "http://localhost:8080";

export const getReservations = () => {
  return axios.get(`${baseURL}/reservation`);
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
