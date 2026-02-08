import type { AxiosError } from "axios"

/**
 * 默认响应接口
 *
 * @template T - 响应数据的类型
 * @property {string} status - 请求状态, 成功为 "OK", 失败为对应错误代码
 * @property {T} data - 负载数据
 */
export interface ResponseData<T> {
  status: string
  data: T
}

/**
 * 默认错误响应接口
 */
export interface ErrorResponseData {
  detail: { code: string }
}

/**
 * 默认请求错误接口
 *
 * @property {string} status - 请求状态, 成功为 "OK", 失败为对应错误代码
 * @property {string} msg - 错误信息文本
 * @property {AxiosError} [originalError] - 原始的 Axios 错误对象
 */
interface RequestError {
  status: number
  msg: string
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
 * @property {string} status - 请求状态, 成功为 "OK", 失败为对应错误代码
 * @property {string} msg - 错误信息文本
 * @property {AxiosError} [originalError] - 原始的 Axios 错误对象
 */
export class RequestErrorImpl extends Error implements RequestError {
/**
 * 创建RequestErrorImpl实例
 *
 * @param {number} status - 请求状态
 * @param {string} msg - 错误信息文本
 * @param {AxiosError} [originalError] - 原始的 Axios 错误对象
 */
  constructor(
    public status: number,
    public msg: string,
    public originalError?: AxiosError,
  ) {
    super(msg)
    this.name = "RequestError"
  }
}
