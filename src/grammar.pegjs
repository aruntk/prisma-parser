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
 = _? prefix: GeneratorPrefix _ name:Name _ ScopeStart nl* declarations:Declaration* ScopeEnd nl* _?
 {
   return {
     name,
     type: prefix,
     declarations,
   }
 }

DatasourceItem
 = _? prefix: DatasourcePrefix _ name:Name _ ScopeStart nl* declarations:Declaration* ScopeEnd nl* _?
 {
   return {
     name,
     type: prefix,
     declarations,
   }
 }


Declaration
 = _? left: Word _? DeclarationIdentifier _? right: (String / Boolean) _? nl*
 {
   return {
     name: left,
     init: {
       type: 'Literal',
       value: right
     }
   }
 }

ModelList
 = nl* models:ModelItem*
 {
   validateTypes(models)
   return models
 }

ModelItem
 = _? prefix: ModelPrefix _ name: Name _ ScopeStart nl* columns: Column* ScopeEnd nl* _?
 {
   return { type: prefix, name, columns };
 }

Column
 = _? name: Name _ data_type: DataType list: ListIdentifier? optional: Optional? _? properties: Properties? _? nl*
   {
   const propertiesObj = Object.assign({}, ...(properties || []))
   return { type: 'Column', name, data_type, optional: !!optional, multiple: !!list, ...propertiesObj } 
 }


Properties
 = p: Property*

Property
 = PropertyIdentifier name: Name
 { 
   var property = {}
   switch(name) {
     case 'id':
       property['primaryKey'] = true
     break
     default:
       property[name] = true
   }
   return property
 }

ModelPrefix
 = "model"

DatasourcePrefix
 = "datasource"

GeneratorPrefix
 = "generator"

String
 = '"' chars: ([^\n\r\f\"])* '"'
 { return chars.join("") }

Boolean
 = "true" / "false"

Name
 = AlphanumericWord

DataType
 = t: Word
 { 
   return processDataTypes(t) 
 }

Optional
 = "?"

ListIdentifier
 = "[]"

ScopeStart
 = [\{]

ScopeEnd
 = [\}]

DeclarationIdentifier
 = "="

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
 = [ \t\r\n\f]

_ "One or more whitespaces"
 = ws+
