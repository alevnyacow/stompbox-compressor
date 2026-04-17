import z, { ZodObject, ZodType } from 'zod'

enum EntityErrors {
    INVALID_CREATION_PAYLOAD = 'ENTITY___INVALID_CREATION_PAYLOAD'
}

export const Entity = <T extends ZodType>(schema: T) => {
    class CompressorEntity {
        public static schema = schema

        public readonly model: z.infer<T>

        constructor(model: z.infer<T>) {
            const parsedModel = schema.parse(model)
            // if (!parsedModel.success) {
            //     Errors(EntityErrors).throw('INVALID_CREATION_PAYLOAD', parsedModel.error)
            // }
            this.model = parsedModel
        }
    }

    return CompressorEntity
}

export const EntityWithStringId = <T extends ZodObject>(schema: T) => {
    class CompressorEntity {
        public static schema = schema.extend({ id: z.string().nonempty() })

        public readonly model: z.infer<T> & { id: string }

        constructor(model: z.infer<T> & { id: string }) {
            const parsedModel = CompressorEntity.schema.parse(model)
            // if (!parsedModel.success) {
            //     Errors(EntityErrors).throw('INVALID_CREATION_PAYLOAD', parsedModel.error)
            // }
            // @ts-ignore
            this.model = parsedModel
        }
    }
}
