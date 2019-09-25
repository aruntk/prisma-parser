import parser from '../parser'

const multipleLinesBetweenScopesSchema = `datasource db1 {
  provider = "mysql"
  url = "mysql://localhost:3306"
}



datasource db2 {
  provider = "postgresql"
  url = "postgresql://localhost:5432"
}`

const multipleLinesBetweenDeclarationsSchema = `datasource db1 {
  provider = "mysql"



  url = "mysql://localhost:3306"
}`

const multipleLinesBetweenColumnsSchema = `model User {
  id Int @id


  name String
}`

const indentationCheckSchema = `
    model User    {
          id     Int   @id
name   String
    }`

const completeSchema = `datasource db1 {
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
}`

describe('PrismaPrinter', () => {
  it('Prints multiple new lines between scopes correctly', async () => {
    const tree = parser.parse(multipleLinesBetweenScopesSchema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })

  it('Prints multiple new lines between declarations correctly', async () => {
    const tree = parser.parse(multipleLinesBetweenDeclarationsSchema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })

  it('Prints multiple new lines between columns correctly', async () => {
    const tree = parser.parse(multipleLinesBetweenColumnsSchema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })

  it('Prints indentation correctly', async () => {
    const tree = parser.parse(indentationCheckSchema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })

  it('Prints ast -> schema correctly for a complete example', async () => {
    const tree = parser.parse(completeSchema)
    const printerOut = parser.print(tree)
    expect(printerOut).toMatchSnapshot()
  })
})
