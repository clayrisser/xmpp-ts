declare module '@xmpp/iq/callee' {
  type JID = import('@xmpp/jid').JID;

  type XmlElement = import('ltx').Element;

  interface IqCalleeFactory {
    (args: {
      middleware: any;
      entity: IqCalleeFactory.Entity;
    }): IqCalleeFactory.IqCallee;
  }

  namespace IqCalleeFactory {
    export interface IqCallee {
      get(ns: string, name: string, handler: Handler): any;
      set(ns: string, name: string, handler: Handler): any;
    }

    export type Handler = (context: Context) => any;

    export interface Context {
      element: XmlElement;
      entity: Entity;
      from: string | null;
    }

    export interface Entity {
      jid: JID;
    }
  }

  export = IqCalleeFactory;
}

declare module '@xmpp/iq/caller' {
  type JID = import('@xmpp/jid').JID;

  type XmlElement = import('ltx').Element;

  interface IqCallerFactory {
    (args: {
      middleware: any;
      entity: IqCallerFactory.Entity;
    }): IqCallerFactory.IqCaller;
  }

  namespace IqCallerFactory {
    export interface IqCaller {
      request(element: XmlElement): Promise<XmlElement>;
    }

    export interface Entity {
      jid?: JID;
    }
  }

  export = IqCallerFactory;
}
