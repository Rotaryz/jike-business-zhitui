/* 深度拷贝 */
export function objDeepCopy (source) {
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}

/* 格式数字 */
export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

/* 当前时间毫秒数 */
export const now = Date.now()

/* 格式化时间 */
export function formatTime (date = now) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 格式化时间
 * @param date 时间
 * @param str 连接符
 * @returns {string}
 */
export function formatTimeYMD (date = now, str = '-') {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [year, month, day].map(formatNumber).join(str)

  return `${t1}`
}
