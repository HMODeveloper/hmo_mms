import axios from "axios"
import type { AxiosRequestConfig } from "axios"

class Request {
  request(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: object | null,
    options?: { headers?: Record<string, string>, params?: object },
  ) {
    const config: AxiosRequestConfig = {
      url: url,
      method: method,
      baseURL: process.env.API_BASE,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }

    // 传递数据
    if (method === "GET" || method === "DELETE") {
      config.params = options?.params ?? (data ?? undefined)
    }
    else {
      config.data = data ?? undefined
    }

    return axios(config) as Promise<unknown>
  }

  // 封装常用方法
  get(url: string, params?: object, headers?: Record<string, string>) {
    return this.request(url, "GET", undefined, { params, headers })
  }

  post(url: string, data?: object, headers?: Record<string, string>) {
    return this.request(url, "POST", data, { headers })
  }

  put(url: string, data?: object, headers?: Record<string, string>) {
    return this.request(url, "PUT", data, { headers })
  }

  delete(url: string, params?: object, headers?: Record<string, string>) {
    return this.request(url, "DELETE", undefined, { params, headers })
  }
}

export default new Request()
