import XmppJsError from '@xmpp/error';
import { Element as XmlElement } from '@xmpp/xml';

export enum XmppErrorCode {
  BadRequest = 'bad-request',
  Conflict = 'conflict',
  FeatureNotImplemented = 'feature-not-implemented',
  Forbidden = 'forbidden',
  Gone = 'gone',
  InternalServerError = 'internal-server-error',
  ItemNotFound = 'item-not-found',
  JidMalformed = 'jid-malformed',
  NotAcceptable = 'not-acceptable',
  NotAllowed = 'not-allowed',
  NotAuthorized = 'not-authorized',
  PaymentRequired = 'payment-required',
  RecipientUnavailable = 'recipient-unavailable',
  Redirect = 'redirect',
  RegistrationRequired = 'registration-required',
  RemoteServerNotFound = 'remote-server-not-found',
  RemoteServerTimeout = 'remote-server-timeout',
  ResourceConstraint = 'resource-constraint',
  ServiceUnavailable = 'service-unavailable',
  SubscriptionRequired = 'subscription-required',
  UndefinedCondition = 'undefined-condition',
  UnexpectedRequest = 'unexpected-request'
}

export default class XmppError extends XmppJsError {
  constructor(code: XmppErrorCode, message: string, element: XmlElement) {
    super(code, message, element);
  }
}
