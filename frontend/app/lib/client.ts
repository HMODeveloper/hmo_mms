import type { FetchError, FetchOptions, FetchResponse } from "ofetch"
import type { ErrorResponseData } from "~/models/response"
import { RequestErrorImpl } from "~/models/response"

const API_URL = "/nitro-api"

interface RequestConfig extends FetchOptions {
  params?: object
}

const request = $fetch.create({
  baseURL: API_URL,
  timeout: 10000,
  credentials: "include",
  onResponse({ response: _response }) {
    // 可以在这里添加响应拦截器逻辑
  },
  onResponseError({ error }) {
    const fetchError = error as FetchError<ErrorResponseData>

    if (fetchError.response) {
      // 接受到非 200 响应
      const response = fetchError.response as FetchResponse<ErrorResponseData>
      throw new RequestErrorImpl(
        response.status,
        response._data?.detail || fetchError.message || "REQUEST_FAILED",
        fetchError,
      )
    }
    else if (fetchError.request) {
      // 未收到响应
      throw new RequestErrorImpl(
        0,
        "NO_RESPONSE",
        fetchError,
      )
    }
    else {
      // 请求发送失败
      throw new RequestErrorImpl(
        -1,
        "REQUEST_SEND_FAILED",
        fetchError,
      )
    }
  },
})

const clientRequest = {
  get: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await request<T>(url, { method: "GET", query: data, ...config })
  },

  post: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await request<T>(url, { method: "POST", body: data, ...config })
  },

  put: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await request<T>(url, { method: "PUT", body: data, ...config })
  },

  delete: async <T>(url: string, data?: object, config?: RequestConfig) => {
    return await request<T>(url, { method: "DELETE", body: data, ...config })
  },
}

export default clientRequest
