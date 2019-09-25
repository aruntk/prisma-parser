import parser from './parser'
import prismaSchema from './prisma.schema'
// import { log } from './utils/log'

const result = parser.parse(prismaSchema)
// log(JSON.stringify(result, null, 4))
parser.print(result)
