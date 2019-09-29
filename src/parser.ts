import * as pegjs from 'pegjs'
import grammar from './grammar'
import { IParserOptions, IPrismaAST } from './interface'
import printer from './printer'

const parser = pegjs.generate(grammar)
export default {
  parse: (prismaQL: string, _options?: IParserOptions): IPrismaAST => {
    return parser.parse(prismaQL)
  },
  print: printer,
}
