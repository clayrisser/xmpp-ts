/**
 * @jsx xml
 * https://tools.ietf.org/html/rfc6121#section-2
 * https://xmpp.org/extensions/xep-0237.html
 */
import xml from '@xmpp/xml';
import { Context as IqContext } from '@xmpp/iq/callee';
import { Element as XmlElement } from 'ltx';
import { EventEmitter } from '@xmpp/events';
import { JID } from '@xmpp/jid';
import { XmppClient } from '@xmpp/client';

export default class RosterClient extends EventEmitter {
  static namespace = 'jabber:iq:roster';

  constructor(public client: XmppClient) {
    super();
    this.client.iqCallee.set(
      RosterClient.namespace,
      'query',
      (context: IqContext) => {
        console.log('IQ Context', context);
        if (context.from !== null) {
          const myJid = context.entity?.jid?.bare();
          const sendingJid = new JID(
            context.from.toString(),
            context.domain
          ).bare();
          // TODO: proper response
          if (!sendingJid.equals(myJid)) return false;
        }
        const child = context.element;
        const rosterItem = this.parseRosterItem(child.getChild('item'));
        if (rosterItem?.subscription === RosterSubscription.REMOVE) {
          this.emit('remove', {
            jid: rosterItem.jid,
            version: child.attrs.ver
          });
        } else {
          this.emit('set', { item: rosterItem, version: child.attrs.ver });
        }
        // TODO: proper response
        return true;
      }
    );
  }

  async get(version?: string): Promise<Roster | undefined> {
    const { iqCaller } = this.client;
    const iqElement = await iqCaller.request(
      <iq type="get">
        <query xmlns={RosterClient.namespace} ver={version} />
      </iq>
    );
    if (iqElement.children.length === 0) return;
    const queryElement = iqElement.getChild('query');
    return {
      items: (queryElement?.getChildren('item') || []).reduce(
        (rosterItems: RosterItem[], itemElement: XmlElement) => {
          const rosterItem = this.parseRosterItem(itemElement);
          if (rosterItem) rosterItems.push(rosterItem);
          return rosterItems;
        },
        []
      ),
      version: queryElement?.attrs.ver
    };
  }

  async set(item: string | JID | RosterClientSetOptions): Promise<void> {
    const { iqCaller } = this.client;
    if (typeof item === 'string' || item instanceof JID) {
      item = { jid: item.toString() };
    }
    const groups = item.groups || [];
    delete item.groups;
    await iqCaller.request(
      <iq type="set">
        <query xmlns={RosterClient.namespace}>
          <item {...item}>
            {groups.map((group: string) => (
              <group>{group}</group>
            ))}
          </item>
        </query>
      </iq>
    );
  }

  async remove(jid: string | JID): Promise<void> {
    const { iqCaller } = this.client;
    await iqCaller.request(
      <iq type="set">
        <query xmlns={RosterClient.namespace}>
          <item jid={jid.toString()} subscription={RosterSubscription.REMOVE} />
        </query>
      </iq>
    );
  }

  on(
    event: 'remove',
    listener: (itme: { jid: JID; version: string }, ...args: any[]) => void
  ): this;
  on(
    event: 'set',
    listener: (item: { item: RosterItem; version: string }, args: any[]) => void
  ): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  parseRosterItem(item?: XmlElement): RosterItem | undefined {
    if (!item) return;
    return {
      ...item.attrs,
      approved: item.attrs.approved === 'true',
      ask: item.attrs.ask === RosterAsk.SUBSCRIBE,
      groups: item.getChildren('group').map((group) => group.text()),
      jid: new JID(item.attrs.jid, this.client.domain),
      name: item.attrs.name || '',
      subscription: item.attrs.subscription || RosterSubscription.NONE
    };
  }
}

export interface Roster {
  version: string;
  items: RosterItem[];
}

export interface RosterItem {
  approved: boolean;
  ask: boolean;
  groups: string[];
  jid: JID;
  name: string;
  subscription: RosterSubscription;
}

export interface RosterClientSetOptions {
  groups?: string[];
  jid: string | JID;
  name?: string;
}

export enum RosterAsk {
  SUBSCRIBE = 'subscribe'
}

export enum RosterSubscription {
  NONE = 'none',
  REMOVE = 'remove'
}
