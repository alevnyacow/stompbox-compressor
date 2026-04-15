export type ErrorCreatingPayload = {
    error: unknown;
    details?: any;
};

export interface ErrorModel {
    name: string;
    message: string;
    code: string;
    timestamp: number;
    details: any | null;
};

export const isError = (error: unknown): error is ErrorModel => {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const requiredKeys = [
        'name',
        'message',
        'code',
        'timestamp',
    ];

    const objKeys = Object.keys(error)
    return requiredKeys.every((x) => objKeys.includes(x));
}

export const isErrorWithCode = <T extends Record<string, string>>(errors: T) => (codeKey: keyof T, error: unknown)  => {
    if (!isError(error)) {
        return false;
    }
    
    return error.code === errors[codeKey];
}

export const newError = <T extends Record<string, string>>(codes: T) => (errorType: keyof T, payload: ErrorCreatingPayload = { error: new Error('unknown error') }): ErrorModel => {
    const { error, details } = payload
    
    let err: Error =
        error instanceof Error ? error : new Error('unknown error');

    if (typeof error === 'string' || typeof error === 'number') {
        err = new Error(error?.toString());
    }

    if (typeof error === 'object' && error !== null) {
        if (error instanceof Error) {
            err = error;
        } else {
            const jsonRepresentation = JSON.stringify(error);
            err = new Error(jsonRepresentation);
        }
    }

    return {
        message: err.message,
        name: err.name,
        timestamp: Date.now(),
        code: codes[errorType],
        details: details || null
    };
};


