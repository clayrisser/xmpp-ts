declare module '@xmpp/iq' {
  type JID = import('@xmpp/jid').JID;

  type XmlElement = import('@xmpp/xml').Element;

  interface IqCalleeMiddleware {
    (args: {
      middleware: any;
      entity: IqCalleeMiddleware.Entity;
    }): IqCalleeMiddleware.IqCallee;
  }

  namespace IqCalleeMiddleware {
    export interface IqCallee {
      get(ns: string, name: string, handler: Handler): any;
      set(ns: string, name: string, handler: Handler): any;
    }

    export type Handler = (context?: Context) => any;

    export interface Context {
      element?: XmlElement;
      entity?: Entity;
      from: string | null;
    }

    export interface Entity {
      jid?: JID;
    }
  }

  export = IqCalleeMiddleware;
}
