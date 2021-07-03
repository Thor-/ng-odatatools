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
const xml2js = require("xml2js");
const request = require("request");
class NoHeaderError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NoHeaderError = NoHeaderError;
function createHeader(options) {
    // Create update information
    const headerobject = JSON.stringify(options, null, '\t');
    let header = `/**************************************************************************
Created by odatatools: https://marketplace.visualstudio.com/items?itemName=apazureck.odatatools\n`;
    header += "Use Command 'odata: xyUpdate to refresh data while this file is active in the editor.\n";
    header += "Creation Time: " + Date() + "\n";
    header += "DO NOT DELETE THIS IN ORDER TO UPDATE YOUR SERVICE\n";
    header += "#ODATATOOLSOPTIONS\n";
    header += headerobject + "\n";
    header += "#ODATATOOLSOPTIONSEND\n";
    return header + "**************************************************************************/\n\n";
}
exports.createHeader = createHeader;
function getGeneratorSettingsFromDocumentText(input) {
    const header = input.match(/#ODATATOOLSOPTIONS([\s\S]*)#ODATATOOLSOPTIONSEND/m);
    if (!header)
        throw new NoHeaderError("No valid odata tools header found.");
    return JSON.parse(header[1]);
}
exports.getGeneratorSettingsFromDocumentText = getGeneratorSettingsFromDocumentText;
function getMetadata(maddr, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let rData = '';
            request.get(maddr, options)
                .on('data', (data) => {
                rData += data;
            })
                .on('complete', (resp) => {
                xml2js.parseString(rData, (err, data) => {
                    try {
                        if (!data["edmx:Edmx"]) {
                            return reject('Response is not valid oData metadata. See output for more information');
                        }
                        if (data["edmx:Edmx"])
                            return resolve(data["edmx:Edmx"]);
                        return reject("Not valid metadata");
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            })
                .on('error', (resp) => {
                return 0;
            });
        });
    });
}
exports.getMetadata = getMetadata;
// @ts-ignore
function GetOutputStyleFromUser() {
    return __awaiter(this, void 0, void 0, function* () {
        // log.TraceEnterFunction();
        //     return await window.showQuickPick(["Modular", "Ambient"], {
        //         placeHolder: "Select to generate the service as a modular or ambient version."
        //     }) as Modularity;
        // }
    });
}
exports.GetOutputStyleFromUser = GetOutputStyleFromUser;
function getChildParentType(type) {
    const typestringSplit = type.split('.');
    if (typestringSplit.length > 2) {
        const childType = typestringSplit[typestringSplit.length - 1];
        typestringSplit.pop();
        const parentType = typestringSplit.join('');
        type = `${parentType}.${childType}`;
    }
    return type;
}
exports.getChildParentType = getChildParentType;
function getType(typestring) {
    let m = typestring.match(/Collection\((.*)\)/);
    if (m) {
        return {
            IsCollection: true,
            Name: getChildParentType(m[1]),
            IsVoid: m[1] === "void",
            Type: m[1]
        };
    }
    // const typestringSplit = typestring.split('.');
    // if (typestringSplit.length > 2) {
    //     const childType = typestringSplit[typestringSplit.length -1];
    //     typestringSplit.pop();
    //     const parentType = typestringSplit.join('');
    //     typestring = `${parentType}.${childType}`;
    // }
    return {
        // get last item after the dot. Join everything before so it's a module... 
        Name: getChildParentType(typestring),
        IsCollection: false,
        IsVoid: typestring === "void",
        Type: typestring
    };
}
exports.getType = getType;
function getHostAddressFromUser() {
    return __awaiter(this, void 0, void 0, function* () {
        let pick = "New Entry...";
        // const rul = Global.recentlyUsedAddresses
        // if (rul && rul.length > 0) {}
        // pick = await window.showQuickPick(["New Entry..."].concat(Global.recentlyUsedAddresses), {
        //     placeHolder: "Select from recently used addresses or add new entry"
        // });
        if (pick === "New Entry...") { }
        // pick = await window.showInputBox({
        //     placeHolder: "http://my.odata.service/service.svc",
        //     value: Global.recentlyUsedAddresses.pop(),
        //     prompt: "Please enter uri of your oData service.",
        //     ignoreFocusOut: true,
        // });
        if (!pick)
            throw new Error("User did not input valid address");
        pick = pick.replace("$metadata", "");
        if (pick.endsWith("/"))
            pick = pick.substr(0, pick.length - 1);
        return pick + "/$metadata";
    });
}
exports.getHostAddressFromUser = getHostAddressFromUser;
function getEntityTypeInterface(type, schema) {
    const p = {
        // Key: type.Key ? type.Key[0].PropertyRef[0].$.Name : undefined,
        Name: type.$.Name,
        Fullname: schema.$.Namespace + "." + type.$.Name,
        Properties: [],
        NavigationProperties: [],
        BaseTypeFullName: type.$.BaseType || undefined,
        OpenType: type.$.OpenType || false,
        Actions: [],
        Functions: [],
    };
    if (type.Property)
        for (let prop of type.Property)
            p.Properties.push({
                Name: prop.$.Name,
                Type: getType(prop.$.Type),
                Nullable: prop.$.Nullable ? (prop.$.Nullable == "false" ? false : true) : true,
            });
    if (type.Key) {
        p.Key = p.Properties[0];
    }
    if (type.NavigationProperty)
        for (const prop of type.NavigationProperty) {
            let navprop = prop;
            p.NavigationProperties.push({
                Name: navprop.$.Name,
                Type: getType(navprop.$.Type),
                Nullable: true,
            });
        }
    return p;
}
exports.getEntityTypeInterface = getEntityTypeInterface;
