import RPCall from '@robincore/flutter-dapp-provider/build/rpc/RPCall';
import {ISetup} from '@robincore/flutter-dapp-provider';

export interface IInAppWebview {
  rpc: RPCall;
  providerNetwork: string;
  setup: ISetup;
}
