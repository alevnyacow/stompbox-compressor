import z, { ZodNumber, ZodObject, ZodRawShape, ZodString, ZodType } from 'zod'

export const CompressorEntity = <
  Shape extends ZodRawShape,
  Id extends ZodString | ZodNumber = ZodString
>(
  schema: ZodObject<Shape>,
  id?: Id
) => {
  const extendedSchema = schema.extend({
    id: id ?? z.string().nonempty() as Id,
  })

  abstract class Entity {
    public static schema = extendedSchema

    private readonly _data: z.infer<typeof extendedSchema>

    constructor(model: z.infer<typeof extendedSchema>) {
      const parsedModel = extendedSchema.parse(model)
      this._data = parsedModel
    }

    public get model(): Readonly<z.infer<typeof extendedSchema>> {
        return Object.freeze(this._data)
    }
  }

  return Entity
}

export const CompressorValueObject = <
  Shape extends ZodType,
>(
  schema: Shape
) => {
  abstract class ValueObject {
    public static schema = schema

    private readonly _data: z.infer<typeof schema>

    constructor(model: z.infer<typeof schema>) {
      const parsedModel = ValueObject.schema.parse(model)
      this._data = parsedModel
    }

    public get model(): Readonly<z.infer<typeof schema>> {
        if (typeof this._data === 'object' && this._data) {
            return Object.freeze(this._data)
        }
        return this._data
    }
  }

  return ValueObject
}
