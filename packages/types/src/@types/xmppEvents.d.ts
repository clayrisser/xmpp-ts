declare module '@xmpp/events' {
  import { EventEmitter as EventsEventEmitter } from 'events';

  export class EventEmitter extends EventsEventEmitter {}
}
