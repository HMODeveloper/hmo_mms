import type { FetchOptions } from "ofetch"
import { RequestErrorImpl } from "~/models/response"

const API_URL = "/nitro-api"

interface RequestConfig extends FetchOptions {
  params?: object
}

const fetch = useRequestFetch().create({
  baseURL: API_URL,
  timeout: 10000,
  credentials: "include",
  onResponseError({ response }) {
    console.error("拦截器: ", response)

    if (response) {
      throw new RequestErrorImpl(
        response.status,
        response._data?.detail || fetchError.message || "REQUEST_FAILED",
      )
    }
    else {
      throw new RequestErrorImpl(
        0,
        "NO_RESPONSE",
      )
    }
  },
})

const request = {
  get: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { method: "GET", query: data, ...config })
  },

  post: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { method: "POST", body: data, ...config })
  },

  put: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { method: "PUT", body: data, ...config })
  },

  delete: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { method: "DELETE", body: data, ...config })
  },
}

export default request
