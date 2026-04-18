import z, { ZodNumber, ZodObject, ZodRawShape, ZodString } from "zod"
import { CompressorError } from "./errors"
import { zodErrorDetails } from '@stompbox/limiter/zod'

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

  abstract class EntityClass {
    public static schema = extendedSchema

    public readonly model: Readonly<z.infer<typeof extendedSchema>>

    constructor(model: z.infer<typeof extendedSchema>) {
      const { success, data, error } = extendedSchema.safeParse(model)
      
      if (!success) {
        throw new CompressorError('InvalidCreationPayload', zodErrorDetails(error))
      }
      this.model = Object.freeze(data)
    }
  }

  return EntityClass
}
