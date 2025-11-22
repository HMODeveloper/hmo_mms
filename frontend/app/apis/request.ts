import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"

const API_URL = "/nitro-api"

const myAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

console.log(API_URL)

const request = {
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    console.log("Request URL:", config.url)
    return new Promise((resolve, reject) => {
      myAxios(config)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
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
