import NetworkService from "../config/interceptor/interceptor";

export const updateProfileService = async (userData: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: "users/profile",
    method: "PUT",
    data: userData,
    withLoader: true,
    withFailureLogs: true
  });
  return response.data;
};