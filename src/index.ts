import parser from './parser'
import prismaSchema from './prisma.schema'

const result = parser.parse(prismaSchema)
parser.print(result)
