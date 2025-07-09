import NetworkService from "../config/interceptor/interceptor";

export const deleteQcmService = (qcmId: number) => {
  return NetworkService.getInstance().sendHttpRequest({
    url: `qcms/${qcmId}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: true
  });
};