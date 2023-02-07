import {InAppProvider} from './InAppProvider';
import {ISetup} from '@robincore/flutter-dapp-provider';
import {IPayload} from '@robincore/flutter-dapp-provider/build/bridge/IParams';

describe('InAppProvider', () => {
  describe('test inAppProvider class with injector', () => {
    const setup: ISetup = {
      currentAddress: '',
      currentProvider: 'https://data-seed-prebsc-2-s3.binance.org:8545',
      chainId: '0x61',
    };
    const inAppProvider = new InAppProvider(setup);

    it('should run without any error', async () => {
      const payload: IPayload = {
        method: 'web3_clientVersion',
        params: [],
        id: 0,
        jsonrpc: '',
      };

      const req = await inAppProvider.request(payload);

      console.log(req);
    });

    it('should sign message given', async function () {
      inAppProvider.eth_sign(["0x9392", "0x1"])
    });
  });
});
