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

    public readonly model: Readonly<z.infer<typeof extendedSchema>>

    constructor(model: z.infer<typeof extendedSchema>) {
      const parsedModel = extendedSchema.parse(model)
      this.model = Object.freeze(parsedModel)
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

    public readonly model: Readonly<z.infer<typeof schema>>

    constructor(model: z.infer<typeof schema>) {
      const parsedModel = ValueObject.schema.parse(model)
      if (typeof parsedModel === 'object' && parsedModel) {
        this.model = Object.freeze(parsedModel)
      } else {
        this.model = parsedModel
      }
    }
  }

  return ValueObject
}
