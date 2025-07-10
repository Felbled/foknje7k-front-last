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
export interface EventPayload {
  title: string;
  startTime: string;
  endTime: string;
  backgroundColor: string;
  discordUrl?: string;
}

export const addEventToGroupService = async (
  id: any,
  data: EventPayload,
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
  data: EventPayload,
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
