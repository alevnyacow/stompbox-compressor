export type ErrorCreatingPayload = {
    error: unknown;
    details?: any;
};

export interface ErrorModel {
    code: string;
    timestamp: number;
    details: any | null;
};

export const isError = (error: unknown): error is ErrorModel => {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const requiredKeys = ['code', 'timestamp'];

    const objKeys = Object.keys(error)
    return requiredKeys.every((x) => objKeys.includes(x));
}

export const isErrorWithCode = <T extends Record<string, string>>(errors: T) => (codeKey: keyof T, error: unknown)  => {
    if (!isError(error)) {
        return false;
    }
    
    return error.code === errors[codeKey];
}
