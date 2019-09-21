import fs from 'fs'
import path from 'path'

const grammar = fs.readFileSync(path.resolve(__dirname, './grammar.pegjs'), 'utf8')


export default grammar
