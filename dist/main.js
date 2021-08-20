"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxyGenerator_1 = require("./proxyGenerator");
const helper_1 = require("./helper");
function createProxy(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let generatorSettings = {
            modularity: "Ambient",
            requestOptions: {},
            source: "unknown",
            useTemplate: undefined
        };
        try {
            let maddr = args.endpoint;
            if (!maddr) {
                throw 'No endpoint specified';
            }
            maddr = maddr.replace("$metadata", "");
            if (maddr.endsWith("/"))
                maddr = maddr.substr(0, maddr.length - 1);
            maddr = maddr + "/$metadata";
            generatorSettings.source = maddr;
            // log.Info("Getting Metadata from '" + maddr + "'");
            const metadata = yield helper_1.getMetadata(maddr);
            yield proxyGenerator_1.generateProxy(metadata, generatorSettings, args);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createProxy = createProxy;
function updateProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        let header;
        try {
            // header = getGeneratorSettingsFromDocumentText(window.activeTextEditor.document.getText());
            if (!header) { }
            // return window.showErrorMessage("Could not find valid odatatools header to generate proxy from. Use 'Create Proxy' command instead.");
            if (!header.source) { }
            // return window.showErrorMessage("No source property in odatatools header. Use 'Create Proxy' command instead.");
            // log.Info("Getting Metadata from '" + header.source + "'");
            // const metadata = await getMetadata(header.source, header.requestOptions);
            // generateProxy(metadata, header, getModifiedTemplates());
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.updateProxy = updateProxy;
// createProxy();
