const reg = new RegExp(/(.*)(\([a-zA-Z]{2}\))$/)

export function nameParser(name?: string): [string, string | undefined] {
  if (!name) {
    return ['', undefined]
  }
  const result = reg.exec(name)
  if (!result) {
    return [name, undefined]
  }
  return [String(result[1]).trim(), String(result[2]).trim()]
}
