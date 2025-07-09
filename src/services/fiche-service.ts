import NetworkService from "../config/interceptor/interceptor";

export const deleteFicheService = (ficheId: number) => {
  return NetworkService.getInstance().sendHttpRequest({
    url: `fiches/${ficheId}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: true
  });
};