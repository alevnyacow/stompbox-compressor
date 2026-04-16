export const Errors = <ErrorCodes extends Record<string, string>>(codes: ErrorCodes) => {
    class CompressorError {
        public constructor(
            public readonly code: string,
            public readonly details: any,
            public readonly message: string | undefined
        ) {}

        static create = (key: keyof ErrorCodes, details?: any) => {
            return new CompressorError(codes[key], details, undefined)
        }

        static createWithMessage = ({ key, message }: { key: keyof ErrorCodes, message: string }, details?: any) => {
            return new CompressorError(codes[key], details, message)
        }

        static checkInstance = (target: unknown, key?: keyof ErrorCodes): target is CompressorError => {
            if (!target) {
                return false
            }
            if (typeof target !== 'object') {
                return false
            }
            
            if (!('code' in target)) {
                return false
            }

            if (typeof target.code !== 'string') {
                return false
            }

            const { code } = target
            const errorCodes = Object.values(codes)
            if (!key) {
                return errorCodes.some(x => x === code)
            }

            return codes[key] === code
        }
    }

    return CompressorError
}