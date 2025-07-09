// src/services/video-service.ts
import NetworkService from "../config/interceptor/interceptor";
import { AxiosResponse } from "axios";

// Interface pour la réponse (optionnel mais recommandé)
interface DeleteResponse {
  success: boolean;
  message?: string;
}

export const deleteVideoService = async (
  videoId: number
): Promise<DeleteResponse> => {
  try {
    const response: AxiosResponse = await NetworkService.getInstance().sendHttpRequest({
      url: `videos/${videoId}`,
      method: "DELETE",
      withLoader: true,
      withFailureLogs: true
    });

    return {
      success: response.status >= 200 && response.status < 300,
      message: response.data?.message || "Video deleted successfully"
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete video"
    };
  }
};