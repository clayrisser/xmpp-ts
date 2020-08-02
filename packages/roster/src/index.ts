import { JID } from '@xmpp/jid';
import { XmppClient } from '@xmpp/client';
import createRosterPlugin, {
  Roster,
  RosterPlugin,
  RosterItem
} from '@xmpp-plugins/roster';

export default class RosterClient {
  static namespace = 'jabber:iq:roster';

  plugin: RosterPlugin;

  constructor(public xmpp: XmppClient) {
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
  ): void;
  on(
    event: 'set',
    listener: (item: { item: RosterItem; version: string }, args: any[]) => void
  ): void;
  on(
    event: string | symbol | 'remove' | 'set',
    listener: (...args: any[]) => void
  ) {
    return this.plugin.on(event, listener);
  }

  get addListener() {
    return this.plugin.addListener;
  }

  get once() {
    return this.plugin.once;
  }

  get removeListener() {
    return this.plugin.removeListener;
  }

  get off() {
    return this.plugin.off;
  }

  get removeAllListeners() {
    return this.plugin.removeAllListeners;
  }

  get setMaxListeners() {
    return this.plugin.setMaxListeners;
  }

  get getMaxListeners() {
    return this.plugin.getMaxListeners;
  }

  get listeners() {
    return this.plugin.listeners;
  }

  get rawListeners() {
    return this.plugin.rawListeners;
  }

  get emit() {
    return this.plugin.emit;
  }

  get listenerCount() {
    return this.plugin.listenerCount;
  }

  get prependListener() {
    return this.plugin.prependListener;
  }

  get prependOnceListener() {
    return this.plugin.prependOnceListener;
  }

  get eventNames() {
    return this.plugin.eventNames;
  }
}

export { Roster, RosterPlugin };
