// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 生成代码 根据用户需求生成前端代码 POST /code-generator/generate */
export async function generateCode(
  body: API.CodeGenerateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCodeGenerateVO>('/code-generator/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 健康检查 检查AI代码生成服务是否正常 GET /code-generator/health */
export async function health(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/code-generator/health', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取生成类型 获取支持的代码生成类型列表 GET /code-generator/types */
export async function getCodeGenTypes(options?: { [key: string]: any }) {
  return request<API.BaseResponseCodeGenTypeEnumArray>('/code-generator/types', {
    method: 'GET',
    ...(options || {}),
  })
}
