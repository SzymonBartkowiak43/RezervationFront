import axios from "axios";

const baseURL = "http://localhost:8080";

export const getSalonImage = (salonId: string) => {
  return axios.get(`${baseURL}/salons/image/${salonId}`);
};

export const uploadSalonImage = (salonId: string, image: FormData) => {
  return axios.post(`${baseURL}/salons/image/${salonId}`, image, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createSalon = (data: any) => {
  return axios.post(`${baseURL}/salon`, data);
};

export const addEmployeeToSalon = (id: string, employeeData: any) => {
  return axios.post(`${baseURL}/salon/${id}/employee`, employeeData);
};

export const addOpeningHours = (data: any) => {
  return axios.patch(`${baseURL}/salon/add-opening-hours`, data);
};

export const getSalons = () => {
  return axios.get(`${baseURL}/salons`);
};

export const getSalonById = (id: string) => {
  return axios.get(`${baseURL}/salons/${id}`);
};
