import { v4 } from "uuid";

type Emitter = {
    on: (eventName: string | symbol, handler: (...args: any[]) => void) => void;
    emit: (eventName: string | symbol, payload: any) => void;
};

export const Event = <Payload>(name = v4()) => {
    abstract class Event {
        constructor(readonly payload: Payload) {}

        fireInEmitter = (emitter: Emitter) => {
            emitter.emit(name, this.payload);
        };

        static handleInEmitter = (
            emitter: Emitter,
            handler: (payload: Payload) => Promise<void> | void,
        ) => {
            emitter.on(name, handler);
        };
    }

    return Event;
};
