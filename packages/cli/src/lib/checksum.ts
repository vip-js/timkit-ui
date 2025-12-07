import crypto from 'crypto'
import fs from 'fs'

export function sha256OfFile(path: string): string {
  const hash = crypto.createHash('sha256')
  const file = fs.readFileSync(path)
  hash.update(file)
  return hash.digest('hex')
}

export function sha256OfString(content: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(content)
  return hash.digest('hex')
}
