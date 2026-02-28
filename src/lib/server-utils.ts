import fs from 'fs'
import path from 'path'

export function loadData(filename: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
