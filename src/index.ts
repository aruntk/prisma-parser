import * as pegjs from 'pegjs'
import grammar from './grammar'
import prismaSchema from './prisma.schema'
import { log } from './utils/log'

const parser = pegjs.generate(grammar)
const result = parser.parse(prismaSchema)
log(JSON.stringify(result, null, 4))
