declare module '@xmpp-plugins/roster' {
  type EventEmitter = import('@xmpp/events').EventEmitter;
  type JID = import('@xmpp/jid').JID;
  type XmppClient = import('@xmpp/client').XmppClient;

  function RosterPluginFactory(
    xmpp: XmppClient
  ): RosterPluginFactory.RosterPlugin;

  namespace RosterPluginFactory {
    export interface Roster {
      version: string;
      items: RosterItem[];
    }

    export interface RosterItem {
      approved: boolean;
      ask: boolean;
      groups: string[];
      jid: JID;
      name: string;
      subscription: string;
    }

    export interface RosterPluginSetOptions {
      jid: string | JID;
      name?: string;
    }

    export interface RosterPlugin extends EventEmitter {
      get(version?: string): Promise<Roster>;
      remove(jid: string): Promise<any>;
      set(options: string | JID | RosterPluginSetOptions): Promise<any>;
    }
  }

  export = RosterPluginFactory;
}
