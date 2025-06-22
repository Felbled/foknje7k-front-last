import NetworkService from "../config/interceptor/interceptor";

export const getSHowMessagesService = async (id: string) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `chat/messages/${id}`,
    method: "GET",
    withLoader: false,
    withFailureLogs: false,
  });
  return response.data;
};
export const getFriendList = async () => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `chat/users`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
