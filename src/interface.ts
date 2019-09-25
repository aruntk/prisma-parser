export interface ICoordinate {
  offset: number
  line: number
  column: number
}
export interface ILocation {
  start: ICoordinate
  end: ICoordinate
}

export interface IDeclarationInit {
  type: 'Literal' | 'Reference'
  value: string | boolean | number
  raw: string
  location: ILocation
}

export interface IDeclarationBase {
  nameLocation: ILocation
  declarationIdentifierLocation: ILocation
  init: IDeclarationInit
}
export interface IDatasourceDeclaration extends IDeclarationBase {
  name: 'provider' | 'url' | 'enabled'
}

export interface IDatasource {
  name: string
  nameLocation: ILocation
  type: 'datasource'
  typeLocation: ILocation
  declarations: IDatasourceDeclaration[]
}

export interface IGeneratorDeclaration extends IDeclarationBase {
  name: 'provider'
}

export type IDeclaration = IDatasourceDeclaration | IGeneratorDeclaration

export interface IGenerator {
  type: 'generator'
  typeLocation: ILocation
  name: string
  nameLocation: ILocation
  declarations: IGeneratorDeclaration[]
}

export type IDefaultDataTypes = 'String' | 'Boolean' | 'Int' | 'Float' | 'Datetime'

export interface IPrimitiveDataType {
  name: IDefaultDataTypes
  type: 'PrimitiveType'
  raw: string
}

export interface IReferenceDataType {
  name: string
  type: 'ReferenceType'
  raw: string
}

// TODO: more types to be added
export type IColumnProperty = 'id' | 'default'

export interface IColumn {
  type: 'Column'
  name: string
  nameLocation: ILocation
  dataType: IPrimitiveDataType | IReferenceDataType
  dataTypeLocation: ILocation
  optional?: boolean
  multiple?: boolean
  primaryKey?: boolean
  propertiesLocation?: ILocation
}

export interface IModel {
  type: 'model'
  name: string
  columns: IColumn[]
}

export interface IPrismaAST {
  type: 'PrismaQL'
  datasources?: IDatasource[]
  generators?: IGenerator[]
  models: IModel[]
}
