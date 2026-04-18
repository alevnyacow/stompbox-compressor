import { Limiter } from "@stompbox/limiter";

enum CompressorErrorCodes {
    InvalidCreationPayload = 'COMPRESSOR_INVALID_CREATION_PAYLOAD'
}

export class CompressorError extends Limiter(CompressorErrorCodes) { }
