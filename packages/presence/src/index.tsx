/**
 * @jsx xml
 * https://xmpp.org/rfcs/rfc6121.html#presence
 */
import Jid from '@xmpp-ts/jid';
import xml, { Element as XmlElement } from '@xmpp/xml';
import { EventEmitter } from '@xmpp/events';
import { XmppClient } from '@xmpp/client';

export interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
}

export default class PresenceClient extends EventEmitter {
  options: PresenceClientOptions;

  logger: Logger = {
    debug: (message?: any, ...optionalParams: any[]) => {
      if (this.options.debug) this.logger.debug(message, ...optionalParams);
    }
  };

  constructor(
    public client: XmppClient,
    options: Partial<PresenceClientOptions> = {}
  ) {
    super();
    this.options = {
      debug: false,
      defaultSubscribeResponse: PresenceType.SUBSCRIBED,
      ...options
    };
    this.client.on('stanza', this.handleStanza.bind(this));
    this.on('presence', this.handlePresence.bind(this));
  }

  handleStanza(presenceElement: XmlElement) {
    if (presenceElement.name === 'presence') {
      const presence = this.parsePresence(presenceElement);
      if (!presence) throw new Error('failed to parse presence');
      this.emit('presence', presence);
    }
  }

  handlePresence(presence: Presence) {
    if (!presence.type) {
      if (!presence.from.bare().equals(this.client.jid.bare())) {
        this.emit('available', presence);
        return;
      }
    }
    switch (presence.type) {
      case PresenceType.SUBSCRIBE: {
        this.emit('subscribe', presence);
        if (this.options.defaultSubscribeResponse) {
          this.send({
            from: this.client.jid,
            to: presence.from,
            type: this.options.defaultSubscribeResponse
          });
        }
        break;
      }
      case PresenceType.UNAVAILABLE: {
        if (!presence.from.bare().equals(this.client.jid.bare())) {
          this.emit('unavailable', presence);
        }
        break;
      }
    }
  }

  send({
    from,
    lang,
    priority,
    show,
    status,
    to,
    type
  }: PresenceClientSendOptions = {}) {
    const children = [];
    if (show) {
      children.push(<show>{show}</show>);
      if (status) children.push(<status>{status}</status>);
    }
    if (typeof priority === 'number') {
      if (priority < -128 || priority > 127) {
        throw new Error('priority must be an integer between -128 and +127');
      }
      children.push(<priority>{priority}</priority>);
    }
    const request = xml(
      'presence',
      {
        'xml:lang': lang,
        from: from?.toString(),
        to: to?.bare().toString(),
        type
      },
      children
    );
    this.client.send(request);
  }

  on(
    event: 'available',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  on(
    event: 'presence',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  on(
    event: 'subscribe',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  on(
    event: 'unavailable',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  removeListener(
    event: 'available',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  removeListener(
    event: 'presence',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  removeListener(
    event: 'subscribe',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  removeListener(
    event: 'unavailable',
    listener: (presence: Presence, args: any[]) => void
  ): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.removeListener(event, listener);
  }

  parsePresence(presenceElement: XmlElement): Presence {
    const fromStr = presenceElement.getAttr('from');
    const from = fromStr ? new Jid(fromStr) : undefined;
    const priorityString = presenceElement.getChild('priority')?.text();
    const showString = presenceElement.getChild('show')?.text();
    const show = showString?.length ? (showString as PresenceShow) : undefined;
    const status = presenceElement.getChild('status')?.text();
    const toStr = presenceElement.getAttr('to');
    const to = toStr ? new Jid(toStr) : undefined;
    const type = presenceElement.getAttr('type');
    const priority = priorityString?.length
      ? Number(priorityString)
      : undefined;
    if (!to || !from) throw new Error('invalid presence stanza');
    return {
      from,
      priority,
      show,
      status,
      to,
      type
    };
  }
}

export enum PresenceShow {
  AWAY = 'away',
  CHAT = 'chat',
  DND = 'dnd',
  XA = 'xa'
}

export enum PresenceType {
  ERROR = 'error',
  PROBE = 'probe',
  SUBSCRIBE = 'subscribe',
  SUBSCRIBED = 'subscribed',
  UNAVAILABLE = 'unavailable',
  UNSUBSCRIBE = 'unsubscribe',
  UNSUBSCRIBED = 'unsubscribed'
}

export interface Presence {
  from: Jid;
  priority?: number;
  show?: PresenceShow;
  status?: string;
  to: Jid;
  type?: PresenceType;
}

export interface PresenceClientOptions {
  defaultSubscribeResponse:
    | PresenceType.UNSUBSCRIBED
    | PresenceType.SUBSCRIBED
    | null;
  debug: boolean;
}

export interface PresenceClientSendOptions {
  from?: Jid;
  lang?: string;
  priority?: number;
  show?: PresenceShow;
  status?: string;
  to?: Jid;
  type?: PresenceType;
}
