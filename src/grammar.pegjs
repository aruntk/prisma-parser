{
  const defaultDataTypes = ['String', 'Boolean', 'Int', 'Float', 'Datetime']
  const encounteredTypes = []
  function validateTypes(models) {
    const modelNames = models.map((model) => {
      return model.name
    })
    for(let i = 0; i < encounteredTypes.length; i += 1) {
      const type = encounteredTypes[i]
      if (modelNames.indexOf(type) === -1) {
        throw new Error('Data type ' + type + ' is undefined')
      }
    }
  }
  function processDataTypes(t) {
    const dataType = {
      name: t,
      type: 'PrimitiveType'
    }
    if (defaultDataTypes.indexOf(t) === -1) {
      encounteredTypes.push(t)
      dataType.type = 'ReferenceType'
    }
    return dataType
  }
}
Start
 = PrismaQL

PrismaQL
 = datasources: DatasourceList? generators: GeneratorList? models: ModelList?
 {
   return {
     type: 'PrismaQL',
     datasources,
     generators,
     models,
   }
 }

GeneratorList
 = nl* generators: GeneratorItem*
 {
   return generators
 }

DatasourceList
 = nl* datasources: DatasourceItem*
 {
   return datasources
 }

GeneratorItem
 = _? prefix: GeneratorPrefix _ name:Name _ scope_start: ScopeStart nl* declarations:Declaration* _? scope_end: ScopeEnd nl* _?
 {
   return {
     name: name.name,
     nameLocation: name.location,
     type: prefix.type,
     typeLocation: prefix.location,
     scopeStartLocation: scope_start.location,
     scopeEndLocation: scope_end.location,
     declarations,
   }
 }

DatasourceItem
 = _? prefix: DatasourcePrefix _ name:Name _ scope_start: ScopeStart _? nl* declarations:Declaration* _? scope_end: ScopeEnd nl* _?
 {
   return {
     name: name.name,
     nameLocation: name.location,
     type: prefix.type,
     typeLocation: prefix.location,
     scopeStartLocation: scope_start.location,
     scopeEndLocation: scope_end.location,
     declarations,
   }
 }


Declaration
 = _? left: DeclarationName _? e: DeclarationIdentifier _? right: (Boolean / String) _? nl*
{
   return {
     name: left.name,
     nameLocation: left.location,
     declarationIdentifierLocation: e.location,
     init: {
       type: 'Literal',
       value: right.value,
       raw: right.raw,
       location: right.location
     },
   }
 }

DeclarationName
 = name: Word
 {
   return {
     name,
     location: location()
   }
 }

ModelList
 = nl* models:ModelItem*
 {
   validateTypes(models)
   return models
 }

ModelItem
 = _? prefix: ModelPrefix _ name: Name _ scope_start: ScopeStart _? nl* columns: Column* _? scope_end: ScopeEnd nl* _?
 {
   return {
    type: prefix.type,
    typeLocation: prefix.location,
    name: name.name,
    nameLocation: name.location,
    scopeStartLocation: scope_start.location,
    scopeEndLocation: scope_end.location,
    columns
   };
 }

Column
 = _? name: Name _ dataType: DataType _? properties: Properties? _? nl*
   {
   const propertiesArrObj = properties || {}
   const propertiesObj = Object.assign({}, ...(propertiesArrObj.properties || []))
   const propertiesLocationObj = propertiesArrObj.location ? { propertiesLocation: propertiesArrObj.location } : {}
    return {
      type: 'Column',
      name: name.name,
      nameLocation: name.location,
      dataType: dataType.type,
      dataTypeLocation: dataType.location,
      optional: dataType.optional,
      multiple: dataType.multiple,
      ...propertiesLocationObj,
      ...propertiesObj
    }
 }


Properties
 = p: Property*
 {
 return {
    properties: p,
    location: location()
 }
 }

Property
 = PropertyIdentifier name: Name
 {
   const property = {}
   const n = name.name
   switch(n) {
     case 'id':
       property['primaryKey'] = true
     break
     default:
       property[n] = true
   }
   return property
 }

ModelPrefix
 = type: "model"
 {
   return {
     type,
     location: location()
   }
}

DatasourcePrefix
 = type: "datasource"
{
   return {
     type,
     location: location()
   }
 }

GeneratorPrefix
 = type: "generator"
{
   return {
     type,
     location: location()
   }
}

String
 = '"' chars: ([^\n\r\f\"])* '"'
 {
   const value = chars.join("")
   return {
     value: value,
     raw: '"' + value + '"',
     location: location()
   }
 }

Boolean
 = b:("true" / "false")
{
  const value = b === "true"
  return {
    value: value,
    raw: b,
    location: location()
  }
}

Name
 = name: AlphanumericWord
{
  return {
    name: name,
    location: location()
  }
}

DataType
 = t: Word list: ListIdentifier? optional: Optional?
 {
   return {
     type: {
       raw: [t, list, optional].join(''),
       ...processDataTypes(t)
     },
     optional: !!optional,
     multiple: !!list,
     location: location()
   }
 }

Optional
 = "?"

ListIdentifier
 = "[]"

ScopeStart
 = text: [\{]
 {
   return {
     text,
     location: location()
   }
 }


ScopeEnd
 = text: [\}]
 {
   return {
     text,
     location: location()
   }
 }

DeclarationIdentifier
 = "="
 {
 return {
    location: location()
 }
 }

Word
 = l:Letter+
 { return l.join(""); }

AlphanumericWord
 = a: Alphanumeric*
 { return a.join(""); }

PropertyIdentifier
 = [@]

Letter
 = [a-zA-Z]

Alphanumeric
 = [a-zA-Z0-9_]

nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"

ws "Whitespace"
 = [ \t]

_ "One or more whitespaces"
 = ws+
