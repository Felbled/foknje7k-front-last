import NetworkService from "../config/interceptor/interceptor";

export const getEventGroupService = async (id: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `groups/${id}/events`,
    method: "GET",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
export const addEventToGroupService = async (
  id: any,
  data: {
    title: string;
    startTime: string;
    endTime: string;
    backgroundColor: string;
  },
) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `groups/${id}/events`,
    method: "POST",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const updateEventGroupService = async (
  id: any,
  eventId: any,
  data: {
    title: string;
    startTime: string;
    endTime: string;
    backgroundColor: string;
  },
) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `groups/${id}/events/${eventId}`,
    method: "PUT",
    withLoader: true,
    withFailureLogs: false,
    data: data,
  });
  return response.data;
};
export const deleteEventGroupService = async (id: any, eventId: any) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `groups/${id}/events/${eventId}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: false,
  });
  return response.data;
};
