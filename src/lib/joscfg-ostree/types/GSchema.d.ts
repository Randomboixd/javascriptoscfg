export type GSchemaOptionTypes =  string | number | boolean | Array<GSchemaOptionTypes>

export type GSchemaOptions = Record<string, GSchemaOptionTypes>

type GSchemaSet = {
    path: string,
    options: GSchemaOptions
}

export default GSchemaSet