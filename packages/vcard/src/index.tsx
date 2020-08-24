/**
 * @jsx xml
 * https://xmpp.org/extensions/xep-0153.html
 * https://xmpp.org/extensions/xep-0054.html
 */
import Jid from '@xmpp-ts/jid';
import xml from '@xmpp/xml';
import { Context as IqContext } from '@xmpp/iq/callee';
import { Element as XmlElement } from 'ltx';
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

  async get(item: getvCard): Promise<any> {
    const { iqCaller } = this.client;

    const iqElement = await iqCaller.request(
      <iq from={item.from} type="get">
        <vCard xmlns={VcardClient.namespace} />
      </iq>
    );
    console.log('iqelement', iqElement);

    if (iqElement.children.length === 0) return;
    const queryElement = iqElement.getChild('vCard');
    console.log('queryElement', queryElement);
    const vcard_child = queryElement?.getChild('PHOTO');
    console.log('vcard_child', vcard_child);
    const ext = vcard_child?.getChild('EXTVAL')?.text();
    console.log('ext', ext);
    // const photo = vcard_child?.getChild('PHOTO');
    // console.log('photo', photo);
    // const extval = photo?.getChildren[0];
    // console.log('extval', extval);
    // const ext = extval?.getChild('EXTVAl');
    // console.log('ext', ext);

    return {
      ext_val: ext
      // extval
      // items: (queryElement?.getChildren("item") || []).reduce(
      //   (rosterItems: RosterItem[], itemElement: XmlElement) => {
      //     const rosterItem = this.parseRosterItem(itemElement);
      //     if (rosterItem) rosterItems.push(rosterItem);
      //     return rosterItems;
      //   },
      //   []
      // ),
      // version: queryElement?.attrs.ver,
    };
  }

  async set(item: vCard): Promise<void> {
    const { iqCaller } = this.client;

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
        // xml('BDAY', {}, '1985'),
        // @ts-ignore
        xml('PHOTO', {}, xml('EXTVAL', {}, item.image))
        // xml('ADR', {}, xml('CTRY', {}, 'India'))
      )
    );

    await iqCaller.request(historyRequest);

    // await iqCaller.request(
    //   <iq from={item.from} type="set">
    //     <vCard xmlns={VcardClient.namespace}>
    //       <BDAY>1476-06-09</BDAY>
    //       <ADR>
    //         <CTRY>Italy</CTRY>
    //       </ADR>
    //       <N>
    //         <GIVEN>Juliet</GIVEN>
    //         <FAMILY>Capulet</FAMILY>
    //       </N>

    //       {/* <photo>
    //         <type>image/jpeg</type>
    //         <binval>{item.image}</binval>
    //       </photo> */}
    //     </vCard>
    //   </iq>
    // );
  }

  parseVCard(context: IqContext) {
    if (context.from !== null) {
      // const myJid = context.entity?.jid?.bare();
      // const sendingJid = new Jid(context.from.local, context.domain).bare();
      // if (!sendingJid.equals(myJid)) return false;
    }
    const child = context.element;
    console.log('child', child);
  }
}

export interface StanzaProfile {
  PHOTO?: StanzaPic[];
}

export interface StanzaPic {
  BINVAL?: string;
}

export interface vCard {
  from?: string;
  image?: string;
  to?: string;
}

export interface getvCard {
  from?: string;
}
