import type { AxiosError } from "axios"

/**
 * 错误返回接口
 *
 * @property {number} status - 状态码
 * @property {string} code - 错误码
 * @property {AxiosError} [originalError] - 原始的 Axios 错误对象
 */
interface RequestError {
  status: number
  code: string
  originalError?: AxiosError
}

/**
 * 请求错误实现类
 *
 * 继承自 Error 类并实现 RequestError 接口, 用于封装 API 请求过程中发生的错误
 *
 * @class RequestErrorImpl
 * @extends Error
 * @implements RequestError
 * @property {number} status - 状态码
 * @property {string} code - 错误码
 * @property {AxiosError} [originalError] - 原始的 Axios 错误对象
 */
export class RequestErrorImpl extends Error implements RequestError {
  constructor(
    public status: number,
    public code: string,
    public originalError?: AxiosError,
  ) {
    super(`${status} ${code}`)
    this.name = "RequestError"
  }
}
