import NetworkService from "../config/interceptor/interceptor";

export const deleteCorrectionService = (correctionId: number) => {
  return NetworkService.getInstance().sendHttpRequest({
    url: `corrections/${correctionId}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: true
  });
};