import {callApi, initApi} from "./api";
import {ApiUpdate} from "./api/types";

function onApiUpdate(upd: ApiUpdate) {
    console.log(upd);
}
function initAPI() {
  initApi(onApiUpdate, {
    isAndroidApp: false,
    isElectron: false,
    isIosApp: false,
    isNativeBottomSheet: false
  });
}
(window as any).initAPI = initAPI;
(window as any).onApiUpdate = onApiUpdate;
//
// function generateMnemonic() {
//   callApi('generateMnemonic').then(result => {
//     // @ts-ignore
//     // Android.generateMnemonic(result);
//     console.log(result)
//   }).catch(error => {
//     console.log("JS: Failed", error);
//   });
// }
// (window as any).generateMnemonic = generateMnemonic;
//
function getMnemonicWordList() {
  return callApi('getMnemonicWordList').then(result => {
    // @ts-ignore
    // Android.getMnemonicWordList(result);
    console.log(result?.length);
  }).catch(error => {
    console.log("JS: Failed", error);
  });
}
(window as any).getMnemonicWordList = getMnemonicWordList;
//
// function validateMnemonic(mnemonic: string[]) {
//   callApi('validateMnemonic', mnemonic).then(result => {
//     // @ts-ignore
//     Android.validateMnemonic(result);
//   }).catch(error => {
//     console.log("JS: Failed", error);
//   });
// }
// (window as any).validateMnemonic = validateMnemonic;
//
// export async function verifyPassword(password: string): Promise<undefined | boolean> {
//     return await callApi('verifyPassword', password);
// }
//
// export async function importMnemonic(mnemonic: string[]): Promise<undefined | { accountId: string, address: string } | { error: string }> {
//     return await callApi('importMnemonic', "mainnet", mnemonic, '');
// }
//
// export async function getAccountBalance(address: string): Promise<undefined | bigint> {
//     return await callApi('getWalletBalance', "mainnet",  address);
// }
