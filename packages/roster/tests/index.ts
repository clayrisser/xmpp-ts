import { client as xmppClient } from '@xmpp/client';
import RosterClient from '../src';

describe('createXmppPlugin', () => {
  it('should create xmpp plugin', async () => {
    const xmpp = xmppClient({});
    const rosterPlugin = new RosterClient(xmpp);
    expect(rosterPlugin).toHaveProperty('get');
  });
});
