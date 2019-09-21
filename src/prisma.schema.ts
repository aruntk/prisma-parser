export default `
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
