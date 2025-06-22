import NetworkService from "../config/interceptor/interceptor";

export const createSubjectService = async (data: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects`,
    method: "POST",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const updateSubjectService = async (id: number, data: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects/${id}`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const getSubjectServiceById = async (id: number) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects/${id}`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getAllUserSubjectService = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const deleteSubjectService = async (id: number) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects/${id}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getAllSubjectsByGroupId = async (id: number) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `subjects/group/${id}`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
