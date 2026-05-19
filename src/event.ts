import { v4 } from "uuid";
import { type EventEmitter } from "events";

export const Event = <Payload>(name = v4()) => {
    abstract class Event {
        constructor(readonly payload: Payload) {}

        fireInEmitter = (emitter: EventEmitter) => {
            emitter.emit(name, this.payload);
        };

        static handleInEmitter = (
            emitter: EventEmitter,
            handler: (payload: Payload) => Promise<void> | void,
        ) => {
            emitter.on(name, handler);
        };
    }

    return Event;
};
