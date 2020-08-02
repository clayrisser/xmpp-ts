import createRosterPlugin, { Roster, RosterPlugin } from '@xmpp-plugins/roster';
import { JID } from '@xmpp/jid';
import { XmppClient } from '@xmpp/client';

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
}

export { Roster, RosterPlugin };
