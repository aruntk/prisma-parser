# prisma-parser

## Installation

`yarn`


## Start

`yarn start`



## Input

```
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
```

## Output

```
{
    "type": "PrismaQL",
    "models": [
        {
            "type": "Model",
            "name": "User",
            "columns": [
                {
                    "type": "Column",
                    "name": "id",
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false,
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "name",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false
                },
                {
                    "type": "Column",
                    "name": "email",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false
                },
                {
                    "type": "Column",
                    "name": "age",
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "optional": true,
                    "multiple": false
                },
                {
                    "type": "Column",
                    "name": "posts",
                    "data_type": {
                        "name": "Post",
                        "type": "ReferenceType"
                    },
                    "optional": false,
                    "multiple": true
                }
            ]
        },
        {
            "type": "Model",
            "name": "Post",
            "columns": [
                {
                    "type": "Column",
                    "name": "id",
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false,
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "title",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false
                },
                {
                    "type": "Column",
                    "name": "content",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    },
                    "optional": false,
                    "multiple": false
                },
                {
                    "type": "Column",
                    "name": "author",
                    "data_type": {
                        "name": "User",
                        "type": "ReferenceType"
                    },
                    "optional": false,
                    "multiple": false
                }
            ]
        }
    ]
}
```
