import { IColumn, IColumnProperty, IDatasource, IDeclaration, IGenerator, IModel, IPrismaAST } from './interface'
import { log } from './utils/log'

const scopeStartChar = '{'
const scopeEndChar = '}'
const newLineChar = '\n'
const equalChar = '='
const propertyIdentifierChar = '@'

const getWhiteSpaceStr = (length: number) => {
  return new Array(length).fill(' ').join('')
}

const processDeclaration = (declaration: IDeclaration) => {
  // TODO: padding needs to be derived from saved location information
  const out = [
    getWhiteSpaceStr(2),
    declaration.name,
    getWhiteSpaceStr(1),
    equalChar,
    getWhiteSpaceStr(1),
    declaration.init.raw,
    newLineChar,
  ]
  return out.join('')
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
  return `${getWhiteSpaceStr(1)}${propertyIdentifierChar}${property}`
}

const processColumn = (column: IColumn) => {
  const out = [getWhiteSpaceStr(2), column.name, getWhiteSpaceStr(1), column.data_type.name]
  if (column.optional) {
    out.push('?')
  }
  if (column.multiple) {
    out.push('[]')
  }
  if (column.primaryKey) {
    out.push(processColumnProperties('id'))
  }
  out.push(newLineChar)
  return out.join('')
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
