import z, { ZodNumber, ZodObject, ZodRawShape, ZodString } from "zod"
import { CompressorError } from "./errors"

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
        const { fieldErrors, formErrors }  = z.flattenError<any, string>(error, x => {
            const path = x.path.length > 1 ? ` at ${x.path.slice(1).join('.')}` : ''
            return `${x.message}${path}`
        })

        const fields = Object.fromEntries(Object.entries(fieldErrors).map(([key, errors]) => [key, errors!.join(', ')]))
        const form = formErrors.length ? { generalErrors: formErrors.join(', ') } : {} as { generalErrors: string[] } | {}

        throw new CompressorError('InvalidCreationPayload', { ...fields, ...form })
      }
      this.model = Object.freeze(data)
    }
  }

  return EntityClass
}
