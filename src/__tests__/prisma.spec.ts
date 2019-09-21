import parser from '../parser'

describe('PrismaParser', () => {
  it('Parses model and primitive type columns correctly', async () => {
    const schema = `
    model User {
      id     Int @id
      name   String
    }`
    const tree = parser.print(parser.parse(schema))
    expect(tree).toMatchSnapshot()
  })
  it('Identify reference type column correctly', async () => {
    const schema = `
    model User {
      id     Int @id
      posts  Post
    }

    model Post {
      id       Int @id
      author   User
    }
    `
    const tree = parser.print(parser.parse(schema))
    expect(tree).toMatchSnapshot()
  })
  it('Identify multiple columns', async () => {
    const schema = `
    model User {
      id     Int @id
      name   String[]
    }
    `
    const tree = parser.print(parser.parse(schema))
    expect(tree).toMatchSnapshot()
  })

  it('Identify optional columns', async () => {
    const schema = `
    model User {
      id     Int @id
      name   String?
    }
    `
    const tree = parser.print(parser.parse(schema))
    expect(tree).toMatchSnapshot()
  })

  it('Throws error if reference type is undefined', async () => {
    const schema = `
    model User {
      id     Int @id
      posts  Post[]
    }
    `
    expect(() => parser.parse(schema)).toThrowError('Data type Post is undefined')
  })
})
