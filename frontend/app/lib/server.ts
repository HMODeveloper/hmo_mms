import type { FetchOptions } from "ofetch"
import clientRequest from "~/lib/client"

interface RequestConfig extends FetchOptions {
  params?: object
}

function getAuthHeaders() {
  const token = useCookie("token")
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

const serverRequest = {
  get: async <T>(url: string, data?: object, config?: RequestConfig) => {
    const headers = {
      ...config?.headers,
      ...getAuthHeaders(),
    }
    return await clientRequest.get<T>(url, data, { ...config, headers })
  },

  post: async <T>(url: string, data?: object, config?: RequestConfig) => {
    const headers = {
      ...config?.headers,
      ...getAuthHeaders(),
    }
    return await clientRequest.post<T>(url, data, { ...config, headers })
  },

  put: async <T>(url: string, data?: object, config?: RequestConfig) => {
    const headers = {
      ...config?.headers,
      ...getAuthHeaders(),
    }
    return await clientRequest.put<T>(url, data, { ...config, headers })
  },

  delete: async <T>(url: string, data?: object, config?: RequestConfig) => {
    const headers = {
      ...config?.headers,
      ...getAuthHeaders(),
    }
    return await clientRequest.delete<T>(url, data, { ...config, headers })
  },
}

export default serverRequest
