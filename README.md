# prisma-parser

## Installation

`yarn`


## Start

`yarn start`

## Test

`yarn jest`



## Input

```
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

```

## Output

```

{
    "type": "PrismaQL",
    "datasources": [
        {
            "name": "db1",
            "type": "datasource",
            "declarations": [
                {
                    "name": "provider",
                    "init": {
                        "type": "Literal",
                        "value": "mysql"
                    }
                },
                {
                    "name": "url",
                    "init": {
                        "type": "Literal",
                        "value": "mysql://localhost:3306"
                    }
                }
            ]
        },
        {
            "name": "db2",
            "type": "datasource",
            "declarations": [
                {
                    "name": "provider",
                    "init": {
                        "type": "Literal",
                        "value": "postgresql"
                    }
                },
                {
                    "name": "url",
                    "init": {
                        "type": "Literal",
                        "value": "postgresql://localhost:5432"
                    }
                }
            ]
        },
        {
            "name": "db3",
            "type": "datasource",
            "declarations": [
                {
                    "name": "provider",
                    "init": {
                        "type": "Literal",
                        "value": "sqlite"
                    }
                },
                {
                    "name": "url",
                    "init": {
                        "type": "Literal",
                        "value": "file:dev.db"
                    }
                },
                {
                    "name": "enabled",
                    "init": {
                        "type": "Literal",
                        "value": "true"
                    }
                }
            ]
        }
    ],
    "generators": [
        {
            "name": "photon",
            "type": "generator",
            "declarations": [
                {
                    "name": "provider",
                    "init": {
                        "type": "Literal",
                        "value": "photonjs"
                    }
                }
            ]
        }
    ],
    "models": [
        {
            "type": "model",
            "name": "User",
            "columns": [
                {
                    "type": "Column",
                    "name": "id",
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "name",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    }
                },
                {
                    "type": "Column",
                    "name": "email",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    }
                },
                {
                    "type": "Column",
                    "name": "age",
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "optional": true
                },
                {
                    "type": "Column",
                    "name": "posts",
                    "data_type": {
                        "name": "Post",
                        "type": "ReferenceType"
                    },
                    "multiple": true
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
                    "data_type": {
                        "name": "Int",
                        "type": "PrimitiveType"
                    },
                    "primaryKey": true
                },
                {
                    "type": "Column",
                    "name": "title",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    }
                },
                {
                    "type": "Column",
                    "name": "content",
                    "data_type": {
                        "name": "String",
                        "type": "PrimitiveType"
                    }
                },
                {
                    "type": "Column",
                    "name": "author",
                    "data_type": {
                        "name": "User",
                        "type": "ReferenceType"
                    }
                }
            ]
        }
    ]
}
```
