# prisma-parser

## Installation

`yarn`


## Start

`yarn start`



## Input

```
model User {
  id         Int       @id
  email      String    @unique
  posts      Post[]
  updatedAt  DateTime  @updatedAt
}
model Post {
  id Int @id
  text String
}
```

## Output

```
{
    "type": "PrismaQL",
    "models": [
        {
            "type": "model",
            "name": "User",
            "columns": [
                {
                    "type": "Column",
                    "name": "id",
                    "meta": "Int",
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "email",
                    "meta": "String",
                    "unique": true
                },
                {
                    "type": "foreignKeyColumn",
                    "name": "posts",
                    "reference": "Post"
                },
                {
                    "type": "Column",
                    "name": "updatedAt",
                    "meta": "DateTime",
                    "updatedAt": true
                }
            ]
        },
        {
            "type": "model",
            "name": "Post",
            "columns": [
                {
                    "type": "Column",
                    "name": "id",
                    "meta": "Int",
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "text",
                    "meta": "String"
                }
            ]
        }
    ]
}

```
