import * as pegjs from 'pegjs'
import grammar from './grammar'

const parser = pegjs.generate(grammar)
const print = (tree: any) => JSON.stringify(tree, null, 4)
export default { parse: parser.parse, print, SyntaxError: parser.SyntaxError }
