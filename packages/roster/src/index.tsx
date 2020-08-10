/**
 * @jsx xml
 * https://xmpp.org/rfcs/rfc6121.html#roster
 * https://xmpp.org/extensions/xep-0237.html
 */
import Jid from '@xmpp-ts/jid';
import xml from '@xmpp/xml';
import { Context as IqContext } from '@xmpp/iq/callee';
import { Element as XmlElement } from 'ltx';
import { EventEmitter } from '@xmpp/events';
import { XmppClient } from '@xmpp/client';

export default class RosterClient extends EventEmitter {
  static namespace = 'jabber:iq:roster';

  constructor(public client: XmppClient) {
    super();
    this.client.iqCallee.set(
      RosterClient.namespace,
      'query',
      this.handleSetQuery.bind(this)
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

  async set(item: string | Jid | RosterClientSetOptions): Promise<void> {
    const { iqCaller } = this.client;
    if (typeof item === 'string' || item instanceof Jid) {
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

  async remove(jid: string | Jid): Promise<void> {
    const { iqCaller } = this.client;
    await iqCaller.request(
      <iq type="set">
        <query xmlns={RosterClient.namespace}>
          <item jid={jid.toString()} subscription={RosterSubscription.REMOVE} />
        </query>
      </iq>
    );
  }

  handleSetQuery(context: IqContext) {
    if (context.from !== null) {
      const myJid = context.entity?.jid?.bare();
      const sendingJid = new Jid(context.from.local, context.domain).bare();
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
    return true;
  }

  on(
    event: 'remove',
    listener: (item: { jid: Jid; version: string }, ...args: any[]) => void
  ): this;
  on(
    event: 'set',
    listener: (item: { item: RosterItem; version: string }, args: any[]) => void
  ): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener) as this;
  }

  removeListener(
    event: 'remove',
    listener: (item: { jid: Jid; version: string }, args: any[]) => void
  ): this;
  removeListener(
    event: 'set',
    listener: (item: { item: RosterItem; version: string }, args: any[]) => void
  ): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return super.removeListener(event, listener);
  }

  parseRosterItem(item?: XmlElement): RosterItem | undefined {
    if (!item) return;
    return {
      ...item.attrs,
      approved: item.attrs.approved === 'true',
      ask: item.attrs.ask === RosterAsk.SUBSCRIBE,
      groups: item.getChildren('group').map((group) => group.text()),
      jid: new Jid(
        item.attrs.jid.split('@')?.[0],
        item.attrs.jid.split('@')?.[1]?.split('/')?.[0] ||
          this.client.jid.domain,
        item.attrs.jid.split('@')?.[1]?.split('/')?.[1]
      ),
      name: item.attrs.name || '',
      subscription: item.attrs.subscription || RosterSubscription.NONE
    };
  }
}

export interface Roster {
  items: RosterItem[];
  version?: string;
}

export interface RosterItem {
  approved: boolean;
  ask: boolean;
  groups: string[];
  jid: Jid;
  name: string;
  subscription: RosterSubscription;
}

export interface RosterClientSetOptions {
  groups?: string[];
  jid: string | Jid;
  name?: string;
}

export enum RosterAsk {
  SUBSCRIBE = 'subscribe'
}

export enum RosterSubscription {
  NONE = 'none',
  REMOVE = 'remove'
}
