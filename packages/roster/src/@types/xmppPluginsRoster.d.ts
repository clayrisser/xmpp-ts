declare module '@xmpp-plugins/roster' {
  type XmppClient = import('@xmpp-ts/client').XmppClient;

  type JID = import('@xmpp/jid').JID;

  function RosterPluginFactory(
    xmpp: XmppClient
  ): RosterPluginFactory.RosterPlugin;

  namespace RosterPluginFactory {
    export interface Roster {
      version: string;
      items: RosterItem[];
    }

    export interface RosterItem {
      [key: string]: any;
    }

    export interface RosterPluginSetOptions {
      jid: string | JID;
      name?: string;
    }

    export interface RosterPlugin {
      get(version?: string): Promise<Roster>;
      remove(jid: string): Promise<any>;
      set(options: string | JID | RosterPluginSetOptions): Promise<any>;
    }
  }

  export = RosterPluginFactory;
}
