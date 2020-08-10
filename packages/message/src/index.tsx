/**
 * @jsx xml
 * https://xmpp.org/rfcs/rfc6121.html#message
 */
import Jid from '@xmpp-ts/jid';
import xml from '@xmpp/xml';
import { EventEmitter } from '@xmpp/events';
import { XmppClient } from '@xmpp/client';

export interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
}

export default class MessageClient extends EventEmitter {
  static namespace = 'jabber:iq:roster';

  options: MessageClientOptions;

  logger: Logger = {
    debug: (message?: any, ...optionalParams: any[]) => {
      if (this.options.debug) this.logger.debug(message, ...optionalParams);
    }
  };

  constructor(
    public client: XmppClient,
    options: Partial<MessageClientOptions> = {}
  ) {
    super();
    this.options = {
      debug: false,
      ...options
    };
  }

  send({ to, body, lang, from }: MessageClientSendOptions = {}) {
    if (!from) from = this.client.jid;
    const id = Date.now().toString();
    const request = xml(
      'message',
      {
        'xml:lang': lang,
        from,
        id,
        to,
        type: 'chat',
        xmlns: MessageClient.namespace
      },
      <body>{body}</body>
    );
    this.client.send(request);
  }

  on(
    event: 'unavailable',
    listener: (message: Message, args: any[]) => void
  ): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  removeListener(
    event: 'unavailable',
    listener: (message: Message, args: any[]) => void
  ): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.removeListener(event, listener);
  }
}

export interface MessageClientOptions {
  debug: boolean;
}

export interface MessageClientSendOptions {
  to?: Jid;
  body?: string;
  lang?: string;
  from?: Jid;
}

export interface Message {
  body: string;
  from: string;
  header?: string;
  id: string;
  lang?: string;
  stamp?: Date;
  to: string;
}
