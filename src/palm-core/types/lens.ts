export interface AttributeData {
  displayType?: MetadataDisplayType
  traitType?: string
  value: string
  key: string
}

export declare enum MetadataDisplayType {
  number = 'number',
  string = 'string',
  date = 'date',
}
