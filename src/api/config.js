const env = process.env.NODE_ENV

const DEV = {
  api: 'https://business-api.jerryf.cn'
}

const TEST = {
  api: 'https://business-api.jkweixin.net'
}

const PROD = {
  api: 'https://business-api.jkweixin.com'
}

export const baseURL = env === 'production' ? PROD : env === 'test' ? TEST : DEV

export const ERR_OK = 0
export const TIME_OUT = 10000
export const ERR_NO = -404
export const TOKEN_OUT = 10000 // token 失效
