import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import axios from "axios"
import config from "@/src/lib/config"
import { RequestErrorImpl } from "@/src/models/response"

const myAxios = axios.create({
  baseURL: `${config.BACKEND_URL}/api`,
  timeout: 10000,
  withCredentials: true,
})

const clientRequest = {
  request: async <T>(config: AxiosRequestConfig): Promise<T> => (
    myAxios(config)
      .then((response: AxiosResponse<T>) => {
        return response.data
      })
      .catch((error: AxiosError<{ detail: string }>) => {
        if (error.response) {
          // 接受到非 200 响应
          const response = error.response
          throw new RequestErrorImpl(
            response.status,
            response.data.detail,
            error,
          )
        }
        else if (error.request) {
          // 未收到响应
          throw new RequestErrorImpl(
            0,
            "NO_RESPONSE",
            error,
          )
        }
        else {
          throw new RequestErrorImpl(
            -1,
            "REQUEST_SEND_FAILED",
            error,
          )
        }
      })),

  get: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await clientRequest.request<T>({ method: "GET", url, params: data, ...config })
  },

  post: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await clientRequest.request<T>({ method: "POST", url, data, ...config })
  },

  put: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await clientRequest.request<T>({ method: "PUT", url, data, ...config })
  },

  delete: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await clientRequest.request<T>({ method: "DELETE", url, data, ...config })
  },
}

export default clientRequest
