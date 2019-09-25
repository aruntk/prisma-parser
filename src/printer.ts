import { IColumn, IColumnProperty, IDatasource, IDeclaration, IGenerator, ILocation, IModel, IPrismaAST } from './interface'
import { log } from './utils/log'

const scopeStartChar = '{'
const scopeEndChar = '}'
const newLineChar = '\n'
const equalChar = '='
const propertyIdentifierChar = '@'

const getWhiteSpaceStr = (length: number) => {
  return new Array(length).fill(' ').join('')
}

interface IOutStrWithLocation {
  text: string 
  location: ILocation
}

const convertStrToLocationObj = (element: IOutStrWithLocation | string, offset: number = 0) => {
  if (typeof element === 'string') {
    return {
      location: {
        end: {
          column: offset + element.length,
          line: NaN,
          offset: NaN,
        },
        start: {
          column: offset,
          line: NaN,
          offset: NaN,
        },
      },
      text: element,
    }
  }
  return element
}

const joinOut = (out: Array<IOutStrWithLocation | string>, joinChar: string = '') => {
  const outObj = out.reduce((a, b, i) => {
    const first = convertStrToLocationObj(a)
    const next = convertStrToLocationObj(b, first.location.end.column)
    const firstIndent = i === 1 ? getWhiteSpaceStr(first.location.start.column - 1) : ''
    return {
      location: next.location,
      text: [
        firstIndent,
        first.text,
        getWhiteSpaceStr(next.location.start.column - first.location.end.column),
        next.text
      ].join(joinChar),
    }
  })
  return typeof outObj !== 'string' ? outObj.text: outObj
}

const processDeclaration = (declaration: IDeclaration) => {
  // TODO: padding needs to be derived from saved location information
  const out = [
    { text: declaration.name, location: declaration.nameLocation },
    { text: equalChar, location: declaration.declarationIdentifierLocation },
    { text: declaration.init.raw, location: declaration.init.location },
    newLineChar,
  ]
  return joinOut(out)
}

const processDatasource = (datasource: IDatasource) => {
  // TODO: padding needs to be derived from saved location information
  const out = [
    datasource.type,
    getWhiteSpaceStr(1),
    datasource.name,
    getWhiteSpaceStr(1),
    scopeStartChar,
    newLineChar,
    ...datasource.declarations.map(processDeclaration),
    scopeEndChar,
  ]
  return out.join('')
}

// same as processDatasource, declared again in case processGenerator becomes get different behaviours in future
const processGenerator = (generator: IGenerator) => {
  // TODO: padding needs to be derived from saved location information
  const out = [
    generator.type,
    getWhiteSpaceStr(1),
    generator.name,
    getWhiteSpaceStr(1),
    scopeStartChar,
    newLineChar,
    ...generator.declarations.map(processDeclaration),
    scopeEndChar,
  ]
  return out.join('')
}

const processColumnProperties = (property: IColumnProperty) => {
  return `${propertyIdentifierChar}${property}`
}

const processColumn = (column: IColumn) => {
  const out: Array<IOutStrWithLocation | string> = [
    { text: column.name, location: column.nameLocation },
    { text: column.dataType.raw, location: column.dataTypeLocation },
  ]
  if (column.primaryKey && column.propertiesLocation) {
    out.push({
      location: column.propertiesLocation,
      text: processColumnProperties('id'),
    })
  }
  out.push(newLineChar)
  return joinOut(out)
}

const processModel = (model: IModel) => {
  // TODO: padding needs to be derived from saved location information
  const out = [
    model.type,
    getWhiteSpaceStr(1),
    model.name,
    getWhiteSpaceStr(1),
    scopeStartChar,
    newLineChar,
    ...model.columns.map(processColumn),
    scopeEndChar,
  ]
  return out.join('')
}

const printer = (tree: IPrismaAST, logToConsole: boolean = true) => {
  const { datasources = [], generators = [], models } = tree
  const datasourceOut = datasources.map(processDatasource)
  const generatorsOut = generators.map(processGenerator)
  const modelsOut = models.map(processModel)
  const out = [...datasourceOut, ...generatorsOut, ...modelsOut]
  const printStr = out.join(newLineChar)
  if (logToConsole) {
    log(printStr)
  }
  return printStr
}
export default printer
