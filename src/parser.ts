import * as pegjs from 'pegjs'
import grammar from './grammar'
import { IPrismaAST } from './interface'
import printer from './printer'

const parser = pegjs.generate(grammar)
export default {
  parse: (prismaQL: string): IPrismaAST => parser.parse(prismaQL),
  print: printer,
}
