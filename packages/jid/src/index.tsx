/**
 * @jsx xml
 * https://xmpp.org/extensions/xep-0029.html
 */
import { JID } from '@xmpp/jid';

export default class Jid extends JID {
  constructor(
    local?: string | JID | JidObject | Jid,
    domain?: string,
    resource?: string
  ) {
    if (typeof local === 'string') {
      if (typeof domain === 'undefined') {
        super(
          local.split('@')?.[0],
          local.split('@')?.[1]?.split('/')?.[0] || domain || 'localhost',
          local.split('@')?.[1]?.split('/')?.[1]
        );
      } else {
        super(local, domain, resource);
      }
    }
    super(
      (local as JidObject)._local,
      (local as JidObject)._domain,
      (local as JidObject)._resource
    );
  }
}

export interface JidObject {
  _domain: string;
  _local: string;
  _resource: string;
}
