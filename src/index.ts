import { Limiter } from '@stompbox/limiter'
import z, { ZodNumber, ZodObject, ZodRawShape, ZodString, ZodType } from 'zod'

export class CompressorError extends Limiter({
    InvalidCreationPayload: 'COMPRESSOR_INVALID_CREATION_PAYLOAD'
} as const) { }

export const Entity = <
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

        const fields = Object.fromEntries(Object.entries(fieldErrors).map(([key, errors]) => [key, errors!.join(', ')]))
        const form = formErrors.length ? { generalErrors: formErrors.join(', ') } : {}

        // @ts-ignore
        throw new CompressorError('InvalidCreationPayload', { ...fields, ...form })
      }
      this.model = Object.freeze(data)
    }
  }

  return Entity
}

export const ValueObject = <
  Shape extends ZodType,
>(
  schema: Shape
) => {
  abstract class ValueObject {
    public static schema = schema

    public readonly model: Readonly<z.infer<typeof schema>>

    constructor(model: z.infer<typeof schema>) {
      const { success, data, error } = schema.safeParse(model)
      
      if (!success) {
        const { fieldErrors, formErrors }  = z.flattenError<any, string>(error, x => {
            const path = x.path.length > 1 ? ` at ${x.path.slice(1).join('.')}` : ''
            return `${x.message}${path}`
        })

        const fields = Object.fromEntries(Object.entries(fieldErrors).map(([key, errors]) => [key, errors!.join(', ')]))
        const form = formErrors.length ? { generalErrors: formErrors.join(', ') } : {}

        // @ts-ignore
        throw new CompressorError('InvalidCreationPayload', { ...fields, ...form })
      }

      if (typeof data === 'object' && data) {
        this.model = Object.freeze(data)
      } else {
        this.model = data
      }
    }
  }

  return ValueObject
}
