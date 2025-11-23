import axios, { type AxiosRequestConfig } from "axios"

interface Response<T> {
  status: number
  data: T
}

const API_URL = "/nitro-api"

const myAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

const request = {
  request<T>(config: AxiosRequestConfig): Promise<Response<T>> {
    return new Promise((resolve, reject) => {
      myAxios(config)
        .then((response) => {
          resolve({
            status: response.status,
            data: response.data as T,
          })
        })
        .catch((error) => {
          const response = error.response
          const data = response.data
          reject({
            status: response.status,
            code: data.detail.code,
            message: data.detail.message || "请求失败",
          })
        })
    })
  },

  get<T>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request<T>({
      method: "GET",
      url,
      params: data,
      ...config,
    })
  },

  post<T>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request<T>({
      method: "POST",
      url,
      data,
      ...config,
    })
  },

  put<T>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request<T>({
      method: "PUT",
      url,
      data,
      ...config,
    })
  },

  delete<T>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request<T>({
      method: "DELETE",
      url,
      data,
      ...config,
    })
  },
}

export default request
