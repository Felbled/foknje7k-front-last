import NetworkService from "../config/interceptor/interceptor";

export const addTeacherToSuperTeacherService = async (teacherId: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `super-teachers/add-teacher`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    params: { teacherId: teacherId },
  });
  return response.data;
};
export const removeTeacherToSuperTeacherService = async (teacherId: string) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `super-teachers/remove-teacher`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    params: { teacherId: teacherId },
  });
  return response.data;
};
export const getAllTeacherFromSuperTeacher = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `super-teachers/all-teacher`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getAllStudentFromSuperTeacher = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `super-teachers/all-student`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const getAllUserByRole = async (
  role: "ROLE_TEACHER" | "ROLE_STUDENT" | "ROLE_SUPER_TEACHER",
) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `users/filter`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
    params: { role: role },
  });
  return response.data;
};
