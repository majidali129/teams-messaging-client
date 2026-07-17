import type { CloudinaryResponse, UploadSignatureResponse } from "@/types";
import { httpClient } from "../client";
import axios from "axios";


export const filesApi = {
    getUploadSignature: () => httpClient.get<UploadSignatureResponse>(`/cloudinary/generate-signature`),
  
    uploadFile: async (url: string, formData: FormData) => {
      // 🚀 Clean & Direct: Use a clean, un-intercepted vanilla Axios post route
      const response = await axios.post<CloudinaryResponse>(url, formData, {
        withCredentials: false, // Disables local cookie tracking
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
  };