import {CoreDappBridge, ISetup} from "@robincore/flutter-dapp-provider";
import {IPayload} from "@robincore/flutter-dapp-provider/build/bridge/IParams";
import RPCall from "@robincore/flutter-dapp-provider/build/rpc/RPCall";
import {CoreUtils} from "@robincore/flutter-dapp-provider/build/core-utils";
import {SignTypedDataVersion, TypedDataUtils} from "@metamask/eth-sig-util";
import isUtf8 from "isutf8";

type funcType<T> = T | undefined;

export class InAppProvider extends CoreDappBridge {
  protected rpc: RPCall;

  constructor( setup: ISetup ) {
    super(setup);
    this.rpc = new RPCall(setup.currentProvider)
  }

  handleCallback<T>( res: T, err: string ): Promise<funcType<T>> {
    return new Promise<T>((resolve, reject) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  }

  request<T>(payload: IPayload): Promise<funcType<T>> {

    return new Promise((resolve, reject) => {
      if (!payload.id) {
        payload.id = CoreUtils.jsonId();
      }
      payload.jsonrpc = "2.0"

      const cb = (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }

      switch (payload.method) {
        case "eth_accounts":
          return this.sendResponse(payload.id, this.eth_Accounts(), cb);
        case "eth_coinbase":
          return this.sendResponse(payload.id, this.address, cb);
        case "eth_chainId":
          return this.sendResponse(payload.id, this.eth_chainId(), cb);
        case "eth_sign":
          return this.ethSign(payload.params);
        case "personal_sign":
          // @ts-ignore
          return this.personal_sign(payload);
        case "eth_signTypedData":
        case "eth_signTypedData_v4":
          // @ts-ignore
          return this.eth_signTypedData(payload, SignTypedDataVersion.V4);
        case "eth_sendTransaction":
          // @ts-ignore
          return this.eth_sendTransaction(payload);
        case "eth_requestAccounts":
          // @ts-ignore
          return this.eth_requestAccounts(payload);
        case "wallet_watchAsset":
          return this.wallet_watchAsset(payload);
        case "wallet_addEthereumChain":
          // @ts-ignore
          return this.wallet_addEthereumChain(payload);
        case "wallet_switchEthereumChain":
          // @ts-ignore
          return this.wallet_switchEthereumChain(payload);
        case "eth_newFilter":
        case "eth_newBlockFilter":
        case "eth_newPendingTransactionFilter":
        case "eth_uninstallFilter":
        case "eth_subscribe":
          throw new Error(
            `Unsupported method`
          );
        default:
          return this.rpc
            .call(payload)
            .then((response) => {
              resolve(response.result);
            })
            .catch(reject);
      }
    });
  }

  sendResponse(id:number, result: any, callback: any) {
    let data = { jsonrpc: "2.0", id: id,
      result: undefined
    };
    if (
      result !== null &&
      typeof result === "object" &&
      result.jsonrpc &&
      result.result
    ) {
      data.result = result.result;
    } else {
      data.result = result;
    }
    if (callback) {
      callback(null, data);
    }
  }

  ethSign(payload: Record<string, unknown> | unknown[] | undefined) {
    // @ts-ignore
    const buffer = CoreUtils.convertToBytes(payload[1]);
    const hex = CoreUtils.payloadInHex(buffer);
    if (isUtf8(buffer)) {
      this._onMessage("signPersonalMessage", { data: hex });
    } else {
      this._onMessage("signMessage", { data: hex });
    }
  }

  personal_sign(payload: Record<string, unknown> | unknown[] | undefined) {
    let message;
    // @ts-ignore
    if (this.address === payload[0]) {
      // @ts-ignore
      message = payload[1];
    } else {
      // @ts-ignore
      message = payload[0];
    }
    const buffer = CoreUtils.convertToBytes(message);
    if (buffer.length === 0) {
      // hex it
      const hex = CoreUtils.payloadInHex(message);
      this._onMessage("signPersonalMessage", { data: hex });
    } else {
      this._onMessage("signPersonalMessage", { data: message });
    }
  }

  eth_signTypedData(payload: any[], version: (SignTypedDataVersion.V3 | SignTypedDataVersion.V4)) {
    // @ts-ignore
    const message = JSON.parse(payload[1]);
    const hash = TypedDataUtils.eip712Hash(message, version);
    this._onMessage("signTypedMessage", {
      data: "0x" + hash.toString("hex"),
      raw: payload[1],
    });
  }

  eth_sendTransaction(payload: Record<string, unknown> | unknown[] | undefined) {
    // @ts-ignore
    this._onMessage("signTransaction", payload[0] ?? {});
  }

  eth_requestAccounts(payload: Record<string, unknown> | unknown[] | undefined) {
    this._onMessage("requestAccounts", {});
  }

  wallet_watchAsset(payload: Record<string, (unknown|any)>) {
    let options = payload.options;
    // @ts-ignore
    this._onMessage("watchAsset", {
      type: payload.type,
      contract: options?.address ?? "",
      symbol: options?.symbol ?? "",
      decimals: (options?.decimals ?? 0) || 0,
    });
  }

  wallet_addEthereumChain(payload: Record<string, unknown> | unknown[] | undefined) {
    // @ts-ignore
    this._onMessage("addEthereumChain", payload[0] ?? {});
  }

  wallet_switchEthereumChain(payload: Record<string, unknown> | unknown[] | undefined) {
    // @ts-ignore
    this._onMessage("switchEthereumChain", payload[0] ?? {});
  }
}
