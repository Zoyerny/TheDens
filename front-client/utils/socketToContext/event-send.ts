import { contextEventEmitter } from "./event-emitter";
import { SocketContextEventId,HandlerContextEventId, AuthContextEventId } from "./event.enums";

export class EventSend {
  sendToHandler(eventId: HandlerContextEventId, data?: any) {
    contextEventEmitter.emit(eventId, data);
  }

  sendToSocket(eventId: SocketContextEventId, data?: any) {
    contextEventEmitter.emit(eventId, data);
  }

  sendToAuth(eventId: AuthContextEventId, data?: any) {
    contextEventEmitter.emit(eventId, data);
  }
}
