declare module '@xmpp/iq/callee' {
  type JID = import('@xmpp/jid').JID;

  type XmppClient = import('@xmpp/client').XmppClient;

  type XmlElement = import('ltx').Element;

  interface IqCalleeFactory {
    (args: { middleware: any; entity: XmppClient }): IqCalleeFactory.IqCallee;
  }

  namespace IqCalleeFactory {
    export interface IqCallee {
      get(ns: string, name: string, handler: Handler): any;
      set(ns: string, name: string, handler: Handler): any;
    }

    export type Handler = (context: Context) => any;

    export interface Context {
      domain: string;
      element: XmlElement;
      entity: XmppClient;
      from: JID | null;
      id: string;
      name: string | null;
      resource: string;
      stanza: XmlElement;
      to: JID | null;
      type: IqType;
    }

    export enum IqType {
      GET = 'get',
      PUSH = 'push',
      RESULT = 'result',
      SET = 'set'
    }
  }

  export = IqCalleeFactory;
}

declare module '@xmpp/iq/caller' {
  type XmppClient = import('@xmpp/client').XmppClient;

  type XmlElement = import('ltx').Element;

  interface IqCallerFactory {
    (args: { middleware: any; entity: XmppClient }): IqCallerFactory.IqCaller;
  }

  namespace IqCallerFactory {
    export interface IqCaller {
      request(element: XmlElement): Promise<XmlElement>;
    }

    export enum IqType {
      GET = 'get',
      PUSH = 'push',
      RESULT = 'result',
      SET = 'set'
    }
  }

  export = IqCallerFactory;
}
