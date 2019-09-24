import parser from '../parser'

const schema = `
datasource db1 {
  provider = "mysql"
  url = "mysql://localhost:3306"
}
datasource db2 {
  provider = "postgresql"
  url = "postgresql://localhost:5432"
}
datasource db3 {
  provider = "sqlite"
  url = "file:dev.db"
  enabled = true
}

generator photon {
  provider = "photonjs"
}
model User {
  id     Int @id
  name   String
  email  String
  age    Int?
  posts  Post[]
}

model Post {
  id       Int @id
  title    String
  content  String
  author   User
}
`

describe('PrismaPrinter', () => {
  it('Prints ast -> schema correctly', async () => {
    const tree = parser.parse(schema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })
})
