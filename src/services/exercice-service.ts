import NetworkService from "../config/interceptor/interceptor";

export const deleteExerciceService = (exerciceId: number) => {
  return NetworkService.getInstance().sendHttpRequest({
    url: `exercices/${exerciceId}`,
    method: "DELETE",
    withLoader: true,
    withFailureLogs: true
  });
};