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
    const bday = queryElement?.getChild('BDAY')?.text();
    const nickName = queryElement?.getChild('NICKNAME')?.text();
    const fullName = queryElement?.getChild('FN')?.text();
    const email = queryElement?.getChild('EMAIL')?.text();
    const address = queryElement?.getChild('ADR');
    const locality = address?.getChild('LOCALITY')?.text();
    const country = address?.getChild('CTRY')?.text();
    const pincode = address?.getChild('PCODE')?.text();
    const jabberId = queryElement?.getChild('JABBERID')?.text();
    const title = queryElement?.getChild('TITLE')?.text();
    const role = queryElement?.getChild('ROLE')?.text();
    const tel = queryElement?.getChild('TEL');
    const number = tel?.getChild('NUMBER')?.text();
    const vCardChild = queryElement?.getChild('PHOTO');
    const ext = vCardChild?.getChild('EXTVAL')?.text();
    return {
      profileImage: ext,
      birthday: bday,
      fullName,
      email,
      locality,
      country,
      nickName,
      title,
      role,
      phoneNumber: number,
      jabberID: jabberId,
      pincode
    };
  }

  async set(item: SetVCard): Promise<void> {
    const { iqCaller } = this.client;
    if (item === undefined) return;
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
        xml('BDAY', {}, item.bday!),
        xml('FN', {}, item.fullName!),
        xml('TITLE', {}, item.title!),
        xml('ROLE', {}, item.role!),
        xml('PHOTO', {}, xml('EXTVAL', {}, item.image!)),
        xml(
          'ADR',
          {},
          xml('CTRY', {}, item.country!),
          xml('LOCALITY', {}, item.locality!),
          xml('PCODE', {}, item.pincode!),
          xml('HOME', {})
        ),
        xml(
          'TEL',
          {},
          xml('HOME', {}),
          xml('VOICE', {}),
          xml('NUMBER', {}, item.number!)
        ),
        xml('JABBERID', {}, item.jabberId!),

        xml('NICKNAME', {}, item.nickName!),
        xml('EMAIL', {}, item.email!)
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
  bday?: string;
  nickName?: string;
  fullName?: string;
  country?: string;
  locality?: string;
  email?: string;
  jabberId?: string;
  number?: string;
  title?: string;
  role?: string;
  pincode?: number;
}

export interface GetVCard {
  from?: string;
  to?: string;
}

export interface VCard {
  profileImage?: string;
}
