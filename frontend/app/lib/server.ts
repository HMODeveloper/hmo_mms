import type { AxiosRequestConfig } from "axios"
import clientRequest from "~/lib/client"

const serverRequest = {
  request: async <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = useCookie("token")

    const headers = {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    return await clientRequest.request<T>({
      ...config,
      headers,
    })
  },

  get: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await serverRequest.request<T>({ method: "GET", url, params: data, ...config })
  },

  post: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await serverRequest.request<T>({ method: "POST", url, data, ...config })
  },

  put: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await serverRequest.request<T>({ method: "PUT", url, data, ...config })
  },

  delete: async <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return await serverRequest.request<T>({ method: "DELETE", url, data, ...config })
  },
}

export default serverRequest
