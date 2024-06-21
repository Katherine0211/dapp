// 判断图片链接是否有域名
export function haveDomain(value) {
  // 判断图片链接里是否有域名
  if (value && value.indexOf('http') != -1) {
    return value
  } else {
    return 'http://127.0.0.1:9000/' + value
  }
}
