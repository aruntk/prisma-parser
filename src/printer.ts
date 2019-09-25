import {
  IColumn,
  IColumnProperty,
  IDatasource,
  IDeclaration,
  IGenerator,
  ILocation,
  IModel,
  IPrismaAST,
} from './interface'
import { log } from './utils/log'

const scopeStartChar = '{'
const scopeEndChar = '}'
const newLineChar = '\n'
const spaceChar = ' '
const equalChar = '='
const propertyIdentifierChar = '@'

const getWhiteSpaceStr = (length: number) => {
  return new Array(length).fill(spaceChar).join('')
}

const getNewLineStr = (length: number) => {
  return new Array(length).fill(newLineChar).join('')
}

interface IOutStrWithLocation {
  text: string
  location: ILocation
}

type ITextWithLocation = IOutStrWithLocation | string
type ITextWithLocationArr = ITextWithLocation[]

const convertStrToLocationObj = (element: ITextWithLocation, leftOffset: number = 0, topOffset: number = 0) => {
  if (typeof element === 'string') {
    return {
      location: {
        end: {
          column: leftOffset + element.length,
          line: topOffset,
          offset: NaN,
        },
        start: {
          column: leftOffset,
          line: topOffset,
          offset: NaN,
        },
      },
      text: element,
    }
  }
  return element
}

const joinWords = (out: ITextWithLocationArr): IOutStrWithLocation => {
  const outObj = out.reduce((a, b, i) => {
    const first = convertStrToLocationObj(a)
    const next = convertStrToLocationObj(b, first.location.end.column, first.location.end.line)
    const firstIndent = i === 1 ? getWhiteSpaceStr(first.location.start.column - 1) : ''
    return {
      location: next.location,
      text: [
        firstIndent,
        first.text,
        getWhiteSpaceStr(next.location.start.column - first.location.end.column),
        next.text,
      ].join(''),
    }
  })
  return convertStrToLocationObj(outObj)
}

const joinLines = (out: ITextWithLocationArr): IOutStrWithLocation => {
  const outObj = out.reduce((a, b) => {
    const first = convertStrToLocationObj(a)
    const next = convertStrToLocationObj(b, first.location.end.column, first.location.end.line)
    return {
      location: next.location,
      text: [first.text, getNewLineStr(next.location.start.line - first.location.end.line), next.text].join(''),
    }
  })
  return convertStrToLocationObj(outObj)
}

const processDeclaration = (declaration: IDeclaration): IOutStrWithLocation => {
  const out = [
    { text: declaration.name, location: declaration.nameLocation },
    { text: equalChar, location: declaration.declarationIdentifierLocation },
    { text: declaration.init.raw, location: declaration.init.location },
  ]
  return joinWords(out)
}

const processDatasource = (datasource: IDatasource) => {
  const words = [
    { text: datasource.type, location: datasource.typeLocation },
    { text: datasource.name, location: datasource.nameLocation },
    { text: scopeStartChar, location: datasource.scopeStartLocation },
  ]
  const lines = [
    joinWords(words),
    ...datasource.declarations.map(processDeclaration),
    { text: scopeEndChar, location: datasource.scopeEndLocation },
  ]
  return lines
}

// same as processDatasource, declared again in case processGenerator becomes get different behaviours in future
const processGenerator = (generator: IGenerator) => {
  const words = [
    { text: generator.type, location: generator.typeLocation },
    { text: generator.name, location: generator.nameLocation },
    { text: scopeStartChar, location: generator.scopeStartLocation },
  ]
  const lines = [
    joinWords(words),
    ...generator.declarations.map(processDeclaration),
    { text: scopeEndChar, location: generator.scopeEndLocation },
  ]
  return lines
}

const processColumnProperties = (property: IColumnProperty) => {
  return `${propertyIdentifierChar}${property}`
}

const processColumn = (column: IColumn) => {
  const out: ITextWithLocationArr = [
    { text: column.name, location: column.nameLocation },
    { text: column.dataType.raw, location: column.dataTypeLocation },
  ]
  if (column.primaryKey && column.propertiesLocation) {
    out.push({
      location: column.propertiesLocation,
      text: processColumnProperties('id'),
    })
  }
  return joinWords(out)
}

const processModel = (model: IModel) => {
  const words = [
    { text: model.type, location: model.typeLocation },
    { text: model.name, location: model.nameLocation },
    { text: scopeStartChar, location: model.scopeStartLocation },
  ]
  const lines = [
    joinWords(words),
    ...model.columns.map(processColumn),
    { text: scopeEndChar, location: model.scopeEndLocation },
  ]
  return lines
}

const printer = (tree: IPrismaAST, logToConsole: boolean = true) => {
  const { datasources = [], generators = [], models } = tree
  const lines: ITextWithLocationArr = []
  datasources.map(datasource => {
    const datasourceLines = processDatasource(datasource)
    lines.push(...datasourceLines)
  })
  generators.map(generator => {
    const generatorLines = processGenerator(generator)
    lines.push(...generatorLines)
  })
  models.map(model => {
    const modelLines = processModel(model)
    lines.push(...modelLines)
  })
  const printStr = joinLines(lines).text
  if (logToConsole) {
    log(printStr)
  }
  return printStr
}
export default printer
