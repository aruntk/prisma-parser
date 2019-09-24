export interface IDeclarationInit {
  type: 'Literal' | 'Reference'
  value: string | boolean | number
  raw: string
}

export interface IDatasourceDeclaration {
  name: 'provider' | 'url' | 'enabled'
  init: IDeclarationInit
}

export interface IDatasource {
  name: string
  type: 'datasource'
  declarations: IDatasourceDeclaration[]
}

export interface IGeneratorDeclaration {
  name: 'provider'
  init: IDeclarationInit
}

export type IDeclaration = IDatasourceDeclaration | IGeneratorDeclaration

export interface IGenerator {
  type: 'generator'
  name: string
  declarations: IGeneratorDeclaration[]
}

export type IDefaultDataTypes = 'String' | 'Boolean' | 'Int' | 'Float' | 'Datetime'

export interface IPrimitiveDataType {
  name: IDefaultDataTypes
  type: 'PrimitiveType'
}

export interface IReferenceDataType {
  name: string
  type: 'ReferenceType'
}

// TODO: more types to be added
export type IColumnProperty = 'id' | 'default'

export interface IColumn {
  type: 'Column'
  name: string
  data_type: IPrimitiveDataType | IReferenceDataType
  optional?: boolean
  multiple?: boolean
  primaryKey?: boolean
}

export interface IModel {
  type: 'model'
  name: 'user'
  columns: IColumn[]
}

export interface IPrismaAST {
  type: 'PrismaQL'
  datasources?: IDatasource[]
  generators?: IGenerator[]
  models: IModel[]
}
