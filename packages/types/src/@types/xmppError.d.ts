declare module '@xmpp/error' {
  type XmlElement = import('@xmpp/xml').Element;

  class XMPPError extends Error {
    constructor(code: string, message: string, element: XmlElement);
  }

  export = XMPPError;
}
