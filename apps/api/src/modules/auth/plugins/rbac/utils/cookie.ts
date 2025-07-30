export const parseCookies = (cookie: string) => {
  const result = []
  const cookies = cookie.split(';')
  for (const c of cookies) {
    const [key, value] = c.split('=')
    result.push([key.trim(), value.trim()])
  }
  return result
}
