import NetworkService from "../config/interceptor/interceptor";

export const createTeacherOfferService = async (data: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher`,
    method: "POST",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const updateTeacherOfferService = async (id: number, data: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher/${id}`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const getAllTeacherOfferService = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getTeacherOfferService = async (id: number) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher/${id}`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const deleteTeacherOfferService = async (id: number) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher/${id}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const sendOfferTeacherService = async (id: number, data: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher-request/${id}`,
    method: "POST",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const respondOfferTeacherService = async (
  id: number,
  status: "ACCEPTED" | "REJECTED",
) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher-request/${id}`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    params: { status: status },
  });
  return response.data;
};

export const getAllTeacherRequests = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher-requests`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getCurrentTeacherRequests = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `offers/teacher/current-requests`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
