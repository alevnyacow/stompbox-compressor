import z, { ZodType } from 'zod'
import { CompressorError } from './errors'

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
        const { fieldErrors, formErrors }  = z.flattenError<any, string>(error, x => {
            const path = x.path.length > 1 ? ` at ${x.path.slice(1).join('.')}` : ''
            return `${x.message}${path}`
        })

        const fields = Object.fromEntries(Object.entries(fieldErrors).map(([key, errors]) => [key, errors!.join(', ')]))
        const form = formErrors.length ? { generalErrors: formErrors.join(', ') } : {} as { formErrors: string[] } | {}

        throw new CompressorError('InvalidCreationPayload', { ...fields, ...form })
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
