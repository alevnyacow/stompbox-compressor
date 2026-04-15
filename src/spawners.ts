import { ErrorModel } from "./base";

export const base = <T extends Record<string, string>>(codes: T) => (errorType: keyof T, details?: any): ErrorModel => {  
    return {
        timestamp: Date.now(),
        code: codes[errorType],
        details: details || null
    };
};