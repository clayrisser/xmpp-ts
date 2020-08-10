/**
 * @jsx xml
 * https://xmpp.org/rfcs/rfc6121.html#message
 */
import Jid from '@xmpp-ts/jid';
import xml from '@xmpp/xml';
import { Element as XmlElement } from 'ltx';
import { EventEmitter } from '@xmpp/events';
import { XmppClient } from '@xmpp/client';

export default class MessageClient extends EventEmitter {
  static namespace = 'jabber:client';

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
    this.client.on('stanza', this.handleStanza.bind(this));
  }

  handleStanza(messageElement: XmlElement) {
    if (messageElement.name === 'message') {
      const message = this.parseMessage(messageElement);
      if (!message) throw new Error('failed to parse message');
      this.emit('message', message);
    }
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

  on(event: 'message', listener: (message: Message, args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  removeListener(
    event: 'message',
    listener: (message: Message, args: any[]) => void
  ): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.removeListener(event, listener);
  }

  parseMessage(messageElement: XmlElement): Message | undefined {
    if (messageElement.getAttr('xmlns') !== MessageClient.namespace) return;
    let archived: Archived | undefined;
    let stanzaId: StanzaId | undefined;
    const archivedElement = messageElement.getChild('archived');
    const stanzaIdElement = messageElement.getChild('stanza-id');
    if (
      archivedElement &&
      archivedElement.getAttr('xmlns') === 'urn:xmpp:mam:tmp'
    ) {
      const id = archivedElement.getAttr('id');
      const byStr = archivedElement.getAttr('by');
      const by = byStr ? new Jid(byStr) : undefined;
      if (by && id) archived = { by, id };
    }
    if (
      stanzaIdElement &&
      stanzaIdElement.getAttr('xmlns') === 'urn:xmpp:sid:0'
    ) {
      const id = stanzaIdElement.getAttr('id');
      const byStr = stanzaIdElement.getAttr('by');
      const by = byStr ? new Jid(byStr) : undefined;
      if (by && id) stanzaId = { by, id };
    }
    const fromStr = messageElement.getAttr('from');
    const from = fromStr ? new Jid(fromStr) : undefined;
    const header = messageElement.getChild('header')?.text() || undefined;
    const id = messageElement.getAttr('id');
    const stamp = new Date();
    const lang = messageElement.getAttr('xml:lang');
    const toStr = messageElement.getAttr('to');
    const to = toStr ? new Jid(toStr) : undefined;
    const body = messageElement
      .getChildren('body')
      .reduce((body: string, bodyElement: XmlElement) => {
        return [body, bodyElement.text()].join('\n');
      }, '');
    if (!body || !from || !to || !id) return;
    return { archived, body, from, header, id, lang, stamp, stanzaId, to };
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
  archived?: Archived;
  body: string;
  from: Jid;
  header?: string;
  id: string;
  lang?: string;
  stamp?: Date;
  stanzaId?: StanzaId;
  to: Jid;
}

export interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
}

export interface Archived {
  by: Jid;
  id: string;
}

export interface StanzaId {
  by: Jid;
  id: string;
}
