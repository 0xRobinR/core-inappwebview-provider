import {InAppProvider} from "./InAppWebviewProvider/InAppProvider";

declare global {
  interface Window {
    inAppProvider: any
  }
}

window.inAppProvider = {
  InAppProvider
}
