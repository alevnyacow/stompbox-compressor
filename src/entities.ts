import z, { ZodType } from 'zod'
import { Errors } from './errors'

enum EntityErrors {
    INVALID_CREATION_PAYLOAD = 'ENTITY___INVALID_CREATION_PAYLOAD'
}

export const Entity = <T extends ZodType>(schema: T) => {
    class CompressorEntity {
        public static schema = schema

        public readonly model: z.infer<T>

        constructor(model: z.infer<T>) {
            const parsedModel = schema.safeParse(model)
            if (!parsedModel.success) {
                Errors(EntityErrors).throw('INVALID_CREATION_PAYLOAD', parsedModel.error)
            }
            this.model = parsedModel.data
        }
    }

    return CompressorEntity
}