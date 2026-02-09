import type { FetchError } from "ofetch"

/**
 * 默认错误响应接口
 */
export interface ErrorResponseData {
  detail: string
}

/**
 * 错误返回接口
 *
 * @property {string} status - 状态码
 * @property {string} code - 错误码
 */
interface RequestError {
  status: number
  code: string
}

/**
 * 请求错误实现类
 *
 * 继承自 Error 类并实现 RequestError 接口, 用于封装 API 请求过程中发生的错误
 *
 * @class RequestErrorImpl
 * @extends Error
 * @implements RequestError
 * @property {string} status - 状态码
 * @property {string} code - 错误码
 */
export class RequestErrorImpl extends Error implements RequestError {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(`${status} ${code}`)
    this.name = "RequestError"
  }
}
