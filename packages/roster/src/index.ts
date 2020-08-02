import { EventEmitter } from '@xmpp/events';
import { JID } from '@xmpp/jid';
import { XmppClient } from '@xmpp/client';
import createRosterPlugin, {
  Roster,
  RosterItem,
  RosterPlugin,
  RosterSubscription
} from '@xmpp-plugins/roster';

export default class RosterClient extends EventEmitter {
  static namespace = 'jabber:iq:roster';

  plugin: RosterPlugin;

  constructor(public xmpp: XmppClient) {
    super();
    this.plugin = createRosterPlugin(xmpp);
  }

  async get(version?: string): Promise<Roster> {
    return this.plugin.get(version);
  }

  async set(jid: string | JID): Promise<void> {
    return this.plugin.set(jid);
  }

  async remove(jid: string | JID): Promise<void> {
    return this.plugin.remove(jid.toString());
  }

  on(
    event: 'remove',
    listener: (itme: { jid: JID; version: string }, ...args: any[]) => void
  ): this;
  on(
    event: 'set',
    listener: (item: { item: RosterItem; version: string }, args: any[]) => void
  ): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return this.plugin.on(event, listener) as this;
  }

  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return this.plugin.once(event, listener) as this;
  }

  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this.plugin.removeListener(event, listener) as this;
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    return this.plugin.off(event, listener) as this;
  }

  removeAllListeners(event?: string | symbol): this {
    return this.plugin.removeAllListeners(event) as this;
  }

  setMaxListeners(n: number): this {
    return this.plugin.setMaxListeners(n) as this;
  }

  getMaxListeners(): number {
    return this.plugin.getMaxListeners();
  }

  listeners(event: string | symbol): Function[] {
    return this.plugin.listeners(event);
  }

  rawListeners(event: string | symbol): Function[] {
    return this.plugin.rawListeners(event);
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    return this.plugin.emit(event, ...args);
  }

  listenerCount(type: string | symbol): number {
    return this.plugin.listenerCount(type);
  }

  prependListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this.plugin.prependListener(event, listener) as this;
  }

  prependOnceListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this.plugin.prependOnceListener(event, listener) as this;
  }

  eventNames(): Array<string | symbol> {
    return this.plugin.eventNames();
  }

  addListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this.plugin.addListener(event, listener) as this;
  }
}

export { Roster, RosterPlugin, RosterItem, RosterSubscription };
