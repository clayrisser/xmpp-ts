declare module '@xmpp/client' {
  type EventEmitter = import('events').EventEmitter;

  type XmlElement = import('ltx').Element;

  type IqCallee = import('@xmpp/iq/callee').IqCallee;

  type JID = import('@xmpp/jid').JID;

  type IqCaller = import('@xmpp/iq/caller').IqCaller;

  export function client(options: {
    service?: string;
    domain?: string;
    resource?: string;
    username?: string;
    password?: string;
    credentials?: (
      auth: (options: { username: string; password: string }) => any,
      mechanism: string
    ) => any;
  }): XmppClient;

  export type XmppClient = EventEmitter & {
    iqCallee: IqCallee;
    iqCaller: IqCaller;
    jid: JID;
    send: (...args: any) => Promise<any>;
    start: () => Promise<any>;
    stop: () => Promise<any>;
    username: string;
  };

  export function jid(): any;

  export function xml(...args: (string | object)[]): any;

  export namespace xml {
    class Element {
      constructor(...args: any[]);

      append(...args: any[]): void;

      prepend(...args: any[]): void;

      setAttrs(...args: any[]): void;
    }

    class Parser {
      constructor(...args: any[]);

      end(...args: any[]): void;

      onEndElement(...args: any[]): void;

      onStartElement(...args: any[]): void;

      onText(...args: any[]): void;

      write(...args: any[]): void;

      static XMLError(...args: any[]): void;

      static defaultMaxListeners: number;

      static init(): void;

      static listenerCount(emitter: any, type: any): any;

      static once(emitter: any, name: any): any;

      static usingDomains: boolean;
    }

    function XMLError(...args: any[]): void;

    function escapeXML(s: any): any;

    function escapeXMLText(s: any): any;

    function unescapeXML(s: any): any;

    function unescapeXMLText(s: any): any;

    function x(name: any, attrs: any, children: any): any;

    namespace Parser {
      class EventEmitter {
        constructor();

        addListener(type: any, listener: any): any;

        emit(type: any, args: any): any;

        eventNames(): any;

        getMaxListeners(): any;

        listenerCount(type: any): any;

        listeners(type: any): any;

        off(type: any, listener: any): any;

        on(type: any, listener: any): any;

        once(type: any, listener: any): any;

        prependListener(type: any, listener: any): any;

        prependOnceListener(type: any, listener: any): any;

        rawListeners(type: any): any;

        removeAllListeners(type: any, ...args: any[]): any;

        removeListener(type: any, listener: any): any;

        setMaxListeners(n: any): any;

        static EventEmitter: any;

        static defaultMaxListeners: number;

        static init(): void;

        static listenerCount(emitter: any, type: any): any;

        static once(emitter: any, name: any): any;

        static usingDomains: boolean;
      }
    }

    namespace XMLError {
      const stackTraceLimit: number;
      function captureStackTrace(p0: any, p1: any): any;
    }
  }
}
