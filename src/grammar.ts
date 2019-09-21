export default `
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
 = ModelList

ModelList
 = nl* _? m:ModelItem*
   {
   validateTypes(m)
   return {
     type: 'PrismaQL',
     models: m
   }
 }

ModelItem
 = p:Prefix _ n:Name _ ScopeStart nl* c:Column* ScopeEnd nl*
 {
   return { type: p, name: n, columns: c };
 }

Column
 = _ n: Name _ m: DataType l: ListIdentifier? o:Optional? _? p: Properties? nl*
   {
   const properties = Object.assign({}, ...(p || []))
   return { type: 'Column', name:  n, data_type: m, optional: !!o, multiple: !!l, ...properties } 
 }


Properties
 = p: Property*

Property
 = PropertyIdentifier n: Name
 { 
   var property = {}
   switch(n) {
     case 'id':
       property['primaryKey'] = true
     break
     default:
       property[n] = true
   }
   return property
 }

Prefix
 = Word

Name
 = Word

DataType
 = t: Word
 { 
   return processDataTypes(t) 
 }

Optional
 = \"?\"

ListIdentifier
 = \"\[\]\"

ScopeStart
 = [\{]

ScopeEnd
 = [\}]

Word
 = l:Letter+
 { return l.join(""); }

PropertyIdentifier
 = [@]

Letter
 = [a-zA-Z]

nl "New line"
 = \"\\n\"

ws "Whitespace"
 = [ \\t]

_ "One or more whitespaces"
 = ws+
 `
