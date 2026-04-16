import z, { ZodType } from 'zod'

export const Entity = <T extends ZodType>(schema: T) => {
    class CompressorEntity {
        public static schema = schema

        public readonly model: z.infer<T>

        constructor(model: z.infer<T>) {
            this.model = schema.parse(model)
        }
    }

    return CompressorEntity
}