import axios from "axios";

const baseURL = "http://164.90.190.165:8080";

export const addOfferToEmployee = (data: any) => {
  return axios.patch(`${baseURL}/employees/add-offer`, data);
};

export const getAvailableDates = (
  selectedEmployeeId: number,
  selectedDate: string,
  selectedOfferId: number
) => {
  return axios.get(`${baseURL}/employee/available-dates`, {
    params: {
      date: selectedDate,
      employeeId: selectedEmployeeId,
      offerId: selectedOfferId,
    },
  });
};

export const getEmployeeToOffer = (offerId: number) => {
  return axios.get(`${baseURL}/employee-to-offer/${offerId}`);
};
