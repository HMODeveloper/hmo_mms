import type { FetchOptions } from "ofetch"
import { RequestErrorImpl } from "~/models/response"

const API_URL = "/nitro-api"

interface RequestConfig extends FetchOptions {
  params?: object
}

const fetch = $fetch.create({
  baseURL: API_URL,
  timeout: 10000,
  credentials: "include",
  onResponseError({ response }) {
    if (response) {
      throw new RequestErrorImpl(
        response.status,
        response._data?.detail || "REQUEST_FAILED",
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

const Request = {
  get: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { ...config, method: "get", query: data })
  },

  post: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { ...config, method: "post", body: data })
  },

  put: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { ...config, method: "put", body: data })
  },

  delete: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await fetch<T>(url, { ...config, method: "delete", body: data })
  },
}

export default Request
