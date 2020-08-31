/**
 * @jsx xml
 * https://xmpp.org/extensions/xep-0153.html
 * https://xmpp.org/extensions/xep-0054.html
 */
import xml from '@xmpp/xml';
import { Context as IqContext } from '@xmpp/iq/callee';
import { EventEmitter } from '@xmpp/events';
import { XmppClient } from '@xmpp/client';

export default class VcardClient extends EventEmitter {
  static namespace = 'vcard-temp';

  constructor(public client: XmppClient) {
    super();
    this.client.iqCallee.set(
      VcardClient.namespace,
      'vCard',
      this.parseVCard.bind(this)
    );
  }

  async get(item: GetVCard): Promise<any> {
    const { iqCaller } = this.client;

    const iqElement = await iqCaller.request(
      <iq from={item.from} to={item.to} type="get">
        <vCard xmlns={VcardClient.namespace} />
      </iq>
    );
    if (iqElement.children.length === 0) return;
    const queryElement = iqElement.getChild('vCard');
    const vCardChild = queryElement?.getChild('PHOTO');
    const ext = vCardChild?.getChild('EXTVAL')?.text();
    return {
      profileImage: ext
    };
  }

  async set(item: SetVCard): Promise<void> {
    const { iqCaller } = this.client;
    if (item.image === undefined) return;
    const historyRequest = xml(
      'iq',
      {
        id: 'vc1',
        type: 'set',
        from: item.from
      },
      xml(
        'vCard',
        {
          xmlns: 'vcard-temp'
        },
        xml('PHOTO', {}, xml('EXTVAL', {}, item.image))
      )
    );

    await iqCaller.request(historyRequest);
  }

  on(event: 'vcard', listener: (vcard: VCard, args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  removeListener(
    event: 'vcard',
    listener: (vcard: VCard, args: any[]) => void
  ): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.removeListener(event, listener);
  }

  parseVCard(context: IqContext) {
    if (context.from !== null) {
      return true;
    }
    return true;
  }
}

export interface SetVCard {
  from?: string;
  image?: string;
}

export interface GetVCard {
  from?: string;
  to?: string;
}

export interface VCard {
  profileImage?: string;
}
