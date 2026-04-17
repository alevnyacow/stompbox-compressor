import { Limiter } from '@stompbox/limiter'
import z, { ZodNumber, ZodObject, ZodRawShape, ZodString, ZodType } from 'zod'

export class CompressorError extends Limiter({
    InvalidCreationPayload: 'COMPRESSOR_INVALID_CREATION_PAYLOAD'
} as const) { }

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
      const { success, data, error } = extendedSchema.safeParse(model)
      
      if (!success) {
        const { fieldErrors, formErrors }  = z.flattenError<any, string>(error, x => {
            const path = x.path.length > 1 ? ` at ${x.path.slice(1).join('.')}` : ''
            return `${x.message}${path}`
        })

        const fields = Object.fromEntries(Object.entries(fieldErrors).map(([key, errors]) => [key, errors.join(', ')]))
        const form = formErrors.length ? { generalErrors: formErrors.join(', ') } : {}

        throw new CompressorError('InvalidCreationPayload', { ...fields, ...form })
      }
      this.model = Object.freeze(data)
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
