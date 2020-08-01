declare module '@xmpp/jid' {
  class JID {
    constructor(local: string, domain?: string, resource?: string);

    bare(): JID;

    equals(jid?: JID): boolean;

    toString(): string;
  }

  export = JID;
}
