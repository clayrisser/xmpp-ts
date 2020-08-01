declare module '@xmpp/iq' {
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
      element?: import('@xmpp/xml').XmlElement;
      entity?: Entity;
      from: string | null;
    }

    export interface Entity {
      jid?: import('@xmpp/jid');
    }
  }

  export = IqCalleeMiddleware;
}
