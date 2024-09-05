"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTransactionError = exports.ApiTransactionDraftError = exports.ApiCommonError = void 0;
var ApiCommonError;
(function (ApiCommonError) {
    ApiCommonError["Unexpected"] = "Unexpected";
    ApiCommonError["ServerError"] = "ServerError";
    ApiCommonError["DebugError"] = "DebugError";
})(ApiCommonError || (exports.ApiCommonError = ApiCommonError = {}));
var ApiTransactionDraftError;
(function (ApiTransactionDraftError) {
    ApiTransactionDraftError["InvalidAmount"] = "InvalidAmount";
    ApiTransactionDraftError["InvalidToAddress"] = "InvalidToAddress";
    ApiTransactionDraftError["InsufficientBalance"] = "InsufficientBalance";
    ApiTransactionDraftError["DomainNotResolved"] = "DomainNotResolved";
    ApiTransactionDraftError["WalletNotInitialized"] = "WalletNotInitialized";
    ApiTransactionDraftError["UnsupportedHardwareOperation"] = "UnsupportedHardwareOperation";
    ApiTransactionDraftError["UnsupportedHardwareContract"] = "UnsupportedHardwareContract";
    ApiTransactionDraftError["EncryptedDataNotSupported"] = "EncryptedDataNotSupported";
    ApiTransactionDraftError["NonAsciiCommentForHardwareOperation"] = "NonAsciiCommentForHardwareOperation";
    ApiTransactionDraftError["TooLongCommentForHardwareOperation"] = "TooLongCommentForHardwareOperation";
    ApiTransactionDraftError["InvalidAddressFormat"] = "InvalidAddressFormat";
})(ApiTransactionDraftError || (exports.ApiTransactionDraftError = ApiTransactionDraftError = {}));
var ApiTransactionError;
(function (ApiTransactionError) {
    ApiTransactionError["PartialTransactionFailure"] = "PartialTransactionFailure";
    ApiTransactionError["IncorrectDeviceTime"] = "IncorrectDeviceTime";
    ApiTransactionError["InsufficientBalance"] = "InsufficientBalance";
    ApiTransactionError["UnsuccesfulTransfer"] = "UnsuccesfulTransfer";
    ApiTransactionError["UnsupportedHardwareContract"] = "UnsupportedHardwareContract";
    ApiTransactionError["UnsupportedHardwarePayload"] = "UnsupportedHardwarePayload";
    ApiTransactionError["NonAsciiCommentForHardwareOperation"] = "NonAsciiCommentForHardwareOperation";
    ApiTransactionError["TooLongCommentForHardwareOperation"] = "TooLongCommentForHardwareOperation";
    ApiTransactionError["UnsupportedHardwareNftOperation"] = "UnsupportedHardwareNftOperation";
})(ApiTransactionError || (exports.ApiTransactionError = ApiTransactionError = {}));
