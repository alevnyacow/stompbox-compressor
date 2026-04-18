import z, { ZodType } from 'zod'
import { CompressorError } from './errors'
import { zodErrorDetails } from '@stompbox/limiter/zod'

export const ValueObject = <
  Shape extends ZodType,
>(
  schema: Shape
) => {
  abstract class ValueObjectClass {
    public static schema = schema

    public readonly model: Readonly<z.infer<typeof schema>>

    constructor(model: z.infer<typeof schema>) {
      const { success, data, error } = schema.safeParse(model)
      
      if (!success) {
        throw new CompressorError('InvalidCreationPayload', zodErrorDetails(error))
      }

      if (typeof data === 'object' && data) {
        this.model = Object.freeze(data)
      } else {
        this.model = data
      }
    }
  }

  return ValueObjectClass
}
