/**
 * @jsx xml
 * https://xmpp.org/extensions/xep-0153.html
 * https://xmpp.org/extensions/xep-0054.html
 */
import Jid from "@xmpp-ts/jid";
import xml from "@xmpp/xml";
import { Context as IqContext } from "@xmpp/iq/callee";
import { Element as XmlElement } from "ltx";
import { EventEmitter } from "@xmpp/events";
import { XmppClient } from "@xmpp/client";

export default class VcardClient extends EventEmitter {
  static namespace = "vcard-temp";

  constructor(public client: XmppClient) {
    super();
    this.client.iqCallee.set(RosterClient.namespace, "vCard");
  }

  async get(version?: string, from?: string, to?: string): Promise<any> {
    const { iqCaller } = this.client;

    const iqElement = await iqCaller.request(
      <iq from={from} to={to} type="get">
        <vcard xmlns={VcardClient.namespace} />
      </iq>
    );
    if (iqElement.children.length === 0) return;
    const queryElement = iqElement.getChild("vCard");
    return {
      //   items: (queryElement?.getChildren("item") || []).reduce(
      //     (rosterItems: RosterItem[], itemElement: XmlElement) => {
      //       const rosterItem = this.parseRosterItem(itemElement);
      //       if (rosterItem) rosterItems.push(rosterItem);
      //       return rosterItems;
      //     },
      //     []
      //   ),
      //   version: queryElement?.attrs.ver,
    };
  }

  async set(image: string): Promise<void> {
    const { iqCaller } = this.client;

    await iqCaller.request(
      <iq type="set">
        <vcard xmlns={VcardClient.namespace}>
          <PHOTO>
            <TYPE>image/jpeg</TYPE>
            <EXTVAL>{image}</EXTVAL>
          </PHOTO>
        </vcard>
      </iq>
    );
  }

//   async remove(jid: string | Jid): Promise<void> {
//     const { iqCaller } = this.client;
//     await iqCaller.request(
//       <iq type="set">
//         <query xmlns={RosterClient.namespace}>
//           <item jid={jid.toString()} subscription={RosterSubscription.REMOVE} />
//         </query>
//       </iq>
//     );
//   }

//   parseRosterItem(item?: XmlElement): RosterItem | undefined {
//     if (!item) return;
//     return {
//       ...item.attrs,
//       approved: item.attrs.approved === "true",
//       ask: item.attrs.ask === RosterAsk.SUBSCRIBE,
//       groups: item.getChildren("group").map((group) => group.text()),
//       jid: new Jid(
//         item.attrs.jid.split("@")?.[0],
//         item.attrs.jid.split("@")?.[1]?.split("/")?.[0] ||
//           this.client.jid.domain,
//         item.attrs.jid.split("@")?.[1]?.split("/")?.[1]
//       ),
//       name: item.attrs.name || "",
//       subscription: item.attrs.subscription || RosterSubscription.NONE,
//     };
//   }
// }

// export interface Roster {
//   items: RosterItem[];
//   version?: string;
// }

// export interface RosterItem {
//   approved: boolean;
//   ask: boolean;
//   groups: string[];
//   jid: Jid;
//   name: string;
//   subscription: RosterSubscription;
// }

// export interface RosterClientSetOptions {
//   groups?: string[];
//   jid: string | Jid;
//   name?: string;
// }

// export enum RosterAsk {
//   SUBSCRIBE = "subscribe",
// }

// export enum RosterSubscription {
//   NONE = "none",
//   REMOVE = "remove",
// }
