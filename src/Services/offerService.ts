import axios from "axios";

const baseURL = "http://localhost:8080";

export const createOffer = (data: any) => {
  return axios.post(`${baseURL}/offer`, data);
};

export const getOffersBySalonId = (salonId: string) => {
  return axios.get(`${baseURL}/offers/${salonId}`);
};
