#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("outtypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("helper", ["require", "exports", "xml2js", "request"], function (require, exports, xml2js, request) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("proxyGenerator", ["require", "exports", "handlebars", "fs-extra", "ncp", "helper", "path", "helper"], function (require, exports, hb, fs, ncp_1, helper_1, path, helper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    hb.registerHelper('joinNamespace', (value) => {
        var t = value.split(".").join("");
        return t;
    });
    hb.registerHelper('splitNameSpaceAndType', (value) => {
        return helper_1.getChildParentType(value);
    });
    hb.logger.log = (level, obj) => {
        // TODO: Forward loglevel;
        console.log("# " + obj);
    };
    function generateProxy(metadata, options, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let schemas = getProxy(options.source.replace("$metadata", ""), metadata["edmx:DataServices"][0], options);
            parseTemplate(options, schemas, args);
        });
    }
    exports.generateProxy = generateProxy;
    function getUnboundActionsAndFunctions(ecschema) {
        let all = [];
        if (ecschema.Action) {
            console.log("Found " + ecschema.Action.length + " OData Actions");
            let acts = ecschema.Action.filter(x => !x.$.IsBound);
            for (let a of acts) {
                a.Type = "Function";
                all.push(a);
            }
        }
        if (ecschema.Function) {
            console.log("Found " + ecschema.Function.length + " OData Functions");
            let fcts = ecschema.Function.filter(x => !x.$.IsBound);
            for (let f of fcts) {
                f.Type = "Function";
                all.push(f);
            }
        }
        return all;
    }
    function getProxy(uri, metadata, options) {
        // get the entity container
        let schemas;
        try {
            schemas = metadata.Schema;
        }
        catch (error) {
            throw new Error("Could not find any entity container on OData Service");
        }
        // Get all types, actions and functions. Get all first in allBaseTypes to process later, as some types can be dependent on schemas later in the odata service.
        const allBaseTypes = {
            actions: [],
            complex: [],
            entity: [],
            enums: [],
            functions: []
        };
        const allschemas = [];
        const typesOfSchema = {};
        for (const schema of schemas) {
            const types = getEdmTypes(schema, options);
            allBaseTypes.complex = allBaseTypes.complex.concat(types.ComplexTypes);
            allBaseTypes.entity = allBaseTypes.entity.concat(types.EntityTypes);
            allBaseTypes.enums = allBaseTypes.enums.concat(types.EnumTypes);
            if (schema.Action) {
                allBaseTypes.actions = allBaseTypes.actions.concat(schema.Action.map(x => {
                    return {
                        Name: x.$.Name,
                        FullName: schema.$.Namespace + "." + x.$.Name,
                        IsBound: x.$.IsBound || false,
                        IsBoundToCollection: x.$.IsBound && x.Parameter[0].$.Type.startsWith("Collection("),
                        Parameters: getParameters(x.Parameter),
                        ReturnType: _getReturnType(x.ReturnType)
                    };
                }));
            }
            if (schema.Function) {
                allBaseTypes.functions = allBaseTypes.functions.concat(schema.Function.map(x => {
                    return {
                        Name: x.$.Name,
                        FullName: schema.$.Namespace + "." + x.$.Name,
                        IsBound: x.$.IsBound || false,
                        IsBoundToCollection: x.$.IsBound && x.Parameter[0].$.Type.startsWith("Collection("),
                        Parameters: getParameters(x.Parameter),
                        ReturnType: _getReturnType(x.ReturnType)
                    };
                }));
            }
            typesOfSchema[schema.$.Namespace] = types;
        }
        const allcomplex = allBaseTypes.complex.concat(allBaseTypes.entity);
        // Resolve Inheritances
        for (const ct of allcomplex) {
            if (ct.BaseTypeFullName)
                ct.BaseType = allcomplex.find(x => x.Fullname === ct.BaseTypeFullName);
        }
        // Get all Bound Actions and Functions. This has to be done seperately, as first of all all types and functions/actions must exist
        for (const action of allBaseTypes.actions) {
            if (!action.IsBound || action.IsBoundToCollection) {
                continue;
            }
            // Get corresponding entity type to which the action is bound to
            const et = allBaseTypes.entity.find(x => x.Fullname === action.Parameters[0].Type.Name);
            if (et) {
                et.Actions.push(action);
            }
        }
        for (const func of allBaseTypes.functions) {
            if (!func.IsBound || func.IsBoundToCollection) {
                continue;
            }
            // Get corresponding entity type to which the action is bound to
            const et = allBaseTypes.entity.find(x => x.Fullname === func.Parameters[0].Type.Name);
            if (et) {
                et.Functions.push(func);
            }
        }
        for (const schema of schemas) {
            const types = typesOfSchema[schema.$.Namespace];
            const curSchema = {
                Namespace: schema.$.Namespace,
                Header: "",
                ComplexTypes: types.ComplexTypes,
                EntityTypes: types.EntityTypes,
                EnumTypes: types.EnumTypes,
                Functions: [],
                Actions: []
            };
            if (schema.EntityContainer) {
                const ec = schema.EntityContainer[0];
                curSchema.EntityContainer = {
                    Namespace: schema.$.Namespace,
                    Name: ec.$.Name,
                    EntitySets: [],
                    Singletons: [],
                    FunctionImports: [],
                    ActionImports: [],
                    FullName: schema.$.Namespace + "." + ec.$.Name
                };
                for (const set of ec.EntitySet) {
                    const eset = {
                        EntityType: allBaseTypes.entity.find(x => {
                            return x.Fullname === set.$.EntityType;
                        }),
                        Namespace: curSchema.Namespace,
                        FullName: curSchema.Namespace + "." + set.$.Name,
                        Name: set.$.Name,
                        NavigationPropertyBindings: set.NavigationPropertyBinding
                            ? set.NavigationPropertyBinding.map(x => {
                                return {
                                    Path: x.$.Path,
                                    Target: x.$.Target
                                };
                            })
                            : [],
                        Actions: [],
                        Functions: []
                    };
                    eset.Actions = getBoundActionsToCollections(eset, allBaseTypes);
                    eset.Functions = getBoundFunctionsToCollections(eset, allBaseTypes);
                    curSchema.EntityContainer.EntitySets.push(eset);
                }
                getUnboundMethods(curSchema, schema);
                getBoundMethodsToEntities(curSchema, schema);
            }
            allschemas.push(curSchema);
        }
        return allschemas;
    }
    function getMethods(schema, allTypes) {
        const ret = [];
        for (const m of schema.Function.concat(schema.Action)) {
            ret.push(getMethod(m, allTypes));
        }
        return ret;
    }
    function getMethod(method, allTypes) {
        if (method.IsBoundToCollection) {
            return getBoundMethod(method, allTypes.entity.filter(x => x.Fullname === method.$.Name)[0]);
        }
    }
    function getUnboundMethods(meta, schema) {
        const ec = schema.EntityContainer[0];
        if (ec.FunctionImport) {
            for (const fi of ec.FunctionImport) {
                const funcImport = {
                    EntitySet: meta.EntityContainer.EntitySets.find(x => x.Name === fi.$.EntitySet),
                    Function: getUnboundMethod(schema.Function.find(x => schema.$.Namespace + "." + x.$.Name === fi.$.Function)),
                    IncludeInServiceDocument: fi.$.IncludeInServiceDocument,
                    Name: fi.$.Name
                };
                meta.EntityContainer.FunctionImports.push(funcImport);
            }
        }
        if (ec.ActionImport) {
            for (const ai of ec.ActionImport) {
                const actionImport = {
                    EntitySet: meta.EntityContainer.EntitySets.find(x => x.Name === ai.$.EntitySet),
                    Action: getUnboundMethod(schema.Action.find(x => schema.$.Namespace + "." + x.$.Name === ai.$.Action)),
                    Name: ai.$.Name
                };
                meta.EntityContainer.ActionImports.push(actionImport);
            }
        }
    }
    function getBoundMethodsToEntities(meta, schema) {
        var _a, _b;
        if (schema.Action) {
            for (const action of schema.Action) {
                for (const entitiSet of (_a = meta.EntityContainer) === null || _a === void 0 ? void 0 : _a.EntitySets) {
                    if (entitiSet.EntityType.Fullname == action.Parameter[0].$.Type) {
                        const m = getBoundMethod(action, entitiSet.EntityType);
                        if (m && !m.IsBoundToCollection) {
                            entitiSet.Actions.push(m);
                        }
                    }
                }
            }
        }
        if (schema.Function) {
            for (const func of schema.Function) {
                for (const entitiSet of (_b = meta.EntityContainer) === null || _b === void 0 ? void 0 : _b.EntitySets) {
                    const fnEntityType = getEntityTypeFromBindingParameter(func.Parameter[0].$.Type);
                    if (entitiSet.EntityType.Fullname == fnEntityType) {
                        const m = getBoundMethod(func, entitiSet.EntityType);
                        if (m && !m.IsBoundToCollection) {
                            entitiSet.Functions.push(m);
                        }
                    }
                }
            }
        }
    }
    function getBoundActionsToCollections(set, schema) {
        const ret = [];
        for (const action of schema.actions) {
            if (action.IsBoundToCollection) {
                const boundTypeName = action.Parameters[0].Type.Type;
                if (set.EntityType.Fullname === boundTypeName) {
                    ret.push(action);
                }
            }
        }
        return ret;
    }
    function getBoundFunctionsToCollections(set, schema) {
        const ret = [];
        for (const func of schema.functions) {
            if (func.IsBoundToCollection) {
                const boundTypeName = func.Parameters[0].Type.Type;
                if (set.EntityType.Fullname === boundTypeName) {
                    // Exclude first bindingParameter from collection bounded function
                    func.Parameters = func.Parameters.filter((_, i) => i > 0);
                    ret.push(func);
                }
            }
        }
        return ret;
    }
    function getUnboundMethod(method) {
        if (!method) {
            return undefined;
        }
        if (method.$.IsBound) {
            return undefined;
        }
        return {
            IsBoundToCollection: method.$.IsBound && method.Parameter[0].$.Name.startsWith("Collection("),
            FullName: method.Namespace,
            IsBound: method.$.IsBound,
            Name: method.$.Name,
            ReturnType: _getReturnType(method.ReturnType),
            Parameters: getParameters(method.Parameter)
        };
    }
    function getEntityTypeFromBindingParameter(parameterType) {
        const collectionMatch = parameterType.match(/^(Collection\()?(.*[^\)])\)?$/);
        return collectionMatch[2];
    }
    function getBoundMethod(method, type) {
        // check if method is bound
        if (!method.$.IsBound) {
            return undefined;
        }
        // check if parameters array exists
        if (!method.Parameter) {
            return undefined;
        }
        // get first parameter, which is the binding parameter and check if it is a collection
        const collectionMatch = method.Parameter[0].$.Type.match(/^(Collection\()?(.*[^\)])\)?$/);
        const isCollectionBound = collectionMatch[1] === "Collection(";
        if (collectionMatch[2] === type.Fullname) {
            const keyParameter = {
                $: {
                    Name: type.Key.Name,
                    Type: type.Key.Type.Name,
                    Nullable: false
                }
            };
            const params = [
                ...(!isCollectionBound ? [keyParameter] : []),
                ...method.Parameter.filter((_, i) => i > 0)
            ];
            const outaction = {
                IsBoundToCollection: isCollectionBound,
                IsBound: method.$.IsBound || false,
                Name: method.$.Name,
                FullName: (type.Namespace || '') + method.$.Name,
                ReturnType: _getReturnType(method.ReturnType),
                Parameters: getParameters(params)
            };
            return outaction;
        }
    }
    function getParameters(params) {
        const ret = [];
        if (!params)
            return [];
        for (const param of params) {
            ret.push({
                Name: param.$.Name,
                Nullable: param.$.Nullable,
                Unicode: param.$.Unicode,
                Type: helper_2.getType(param.$.Type),
                MaxLength: param.$.MaxLength,
                Precision: param.$.Precision,
                Scale: param.$.Scale,
                SRID: param.$.SRID
            });
        }
        return ret;
    }
    function _getParameters(parameters) {
        let ret = "";
        if (!parameters)
            return "";
        for (let param of parameters) {
            ret += param.$.Name + ": " + param.$.Type + ", ";
        }
        // return list without last ", "
        return ret.substr(0, ret.length - 2);
    }
    function _getReturnType(returntype) {
        if (!returntype)
            return {
                Name: "void",
                IsCollection: false,
                IsVoid: true,
                Type: 'void'
            };
        return helper_2.getType(returntype[0].$.Type);
    }
    function _getParameterJSON(parameters) {
        let ret = "{\n";
        for (let param of parameters) {
            ret += param.$.Name + ": " + param.$.Name + ",\n";
        }
        ret = ret.substr(0, ret.length - 2) + "\n";
        return ret + "}";
    }
    function _getRequestUri(method) {
        let uri = 'requestUri: this.Address  + "';
        if (method.Type === "Function") {
            uri +=
                (method.$.IsBound
                    ? method.IsBoundToCollection ? "" : '("+key+")'
                    : "") +
                    "/" +
                    (method.$.IsBound ? method.Namespace + "." : "") +
                    method.$.Name +
                    _getRequestParameters(method.Parameter) +
                    '",\n';
        }
        else
            uri +=
                (method.$.IsBound
                    ? method.IsBoundToCollection ? "" : '("+key+")'
                    : "") +
                    "/" +
                    (method.$.IsBound ? method.Namespace + "." : "") +
                    method.$.Name +
                    '",\n';
        return uri;
    }
    function _getRequestParameters(parameters) {
        if (!parameters)
            return "";
        let ret = "(";
        for (let param of parameters) {
            ret += param.$.Name + '=" + ' + param.$.Name + ' + ", ';
        }
        ret = ret.substr(0, ret.length - 2);
        return ret + ")";
    }
    function parseTemplate(generatorSettings, schemas, args) {
        const proxy = {
            schemas,
            Header: helper_2.createHeader(generatorSettings)
        };
        try {
            if (!args.outDir) {
                throw 'outDir argument not set';
            }
            const baseTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/proxy.hbs'), 'utf-8');
            const moduleTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/module.hbs'), 'utf-8');
            const templates = [];
            const compiledTemplate = hb.compile(baseTemplate, {
                noEscape: true
            });
            fs.emptyDirSync(args.outDir);
            fs.writeFileSync(`${args.outDir}/Base.ts`, compiledTemplate(schemas));
            const compiledModuleTemplate = hb.compile(moduleTemplate, {
                noEscape: true
            });
            templates.push(compiledTemplate(proxy));
            schemas.forEach(schema => {
                const namespace = schema.Namespace.split('.').join('');
                fs.writeFileSync(`${args.outDir}/${namespace}.ts`, compiledModuleTemplate({
                    schema: schema,
                    allSchemas: schemas
                }));
            });
            ncp_1.ncp(path.resolve(__dirname, '../src/edmTypes.ts'), `${args.outDir}/edmTypes.ts`, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('done!');
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    function getEdmTypes(schema, generatorSettings) {
        let metadata = {
            Header: "",
            EntityTypes: [],
            ComplexTypes: [],
            EnumTypes: []
        };
        if (schema.EntityType) {
            for (let type of schema.EntityType) {
                const p = helper_2.getEntityTypeInterface(type, schema);
                metadata.EntityTypes.push(p);
            }
        }
        if (schema.ComplexType) {
            for (let type of schema.ComplexType) {
                const p = {
                    Namespace: schema.$.Namespace,
                    Fullname: schema.$.Namespace + "." + type.$.Name,
                    Name: type.$.Name,
                    Properties: [],
                    BaseTypeFullName: type.$.BaseType || undefined,
                    OpenType: type.$.OpenType || false
                };
                if (type.Property)
                    for (let prop of type.Property)
                        p.Properties.push({
                            Name: prop.$.Name,
                            Type: helper_2.getType(prop.$.Type),
                            Nullable: prop.$.Nullable
                                ? prop.$.Nullable == "false" ? false : true
                                : true
                        });
                metadata.ComplexTypes.push(p);
            }
        }
        if (schema.EnumType) {
            for (let enumtype of schema.EnumType) {
                const p = {
                    Name: enumtype.$.Name,
                    Members: []
                };
                for (const member of enumtype.Member) {
                    p.Members.push({
                        Key: member.$.Name,
                        Value: member.$.Value
                    });
                }
                metadata.EnumTypes.push(p);
            }
        }
        return metadata;
    }
    exports.getEdmTypes = getEdmTypes;
});
define("main", ["require", "exports", "proxyGenerator", "helper"], function (require, exports, proxyGenerator_1, helper_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                const metadata = yield helper_3.getMetadata(maddr);
                yield proxyGenerator_1.generateProxy(metadata, generatorSettings, args);
            }
            catch (error) {
                // window.showErrorMessage("Could not create proxy. See output window for detail.");
                // log.Error("Creating proxy returned following error:");
                if (error.originalStack) { }
                // log.Error(error.originalStack);
                else { }
                // log.Error(error.toString());
                // log.Info("Updating current file.");
                // await window.activeTextEditor.edit((editbuilder) => {
                //     editbuilder.replace(new Range(0, 0, window.activeTextEditor.document.lineCount - 1, window.activeTextEditor.document.lineAt(window.activeTextEditor.document.lineCount - 1).text.length), createHeader(generatorSettings));
                // });
                // log.Info("Successfully pasted data. Formatting Document.")
                // commands.executeCommand("editor.action.formatDocument").then(() => log.Info("Finished"));
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
                // window.showErrorMessage("Could not create proxy. See output window for detail.");
                // log.Error("Creating proxy returned following error:");
                if (error.originalStack) {
                    // log.Error(error.originalStack);
                }
                else {
                }
                // log.Error(error.toString());
                // log.Info("Updating current file.");
                // await window.activeTextEditor.edit((editbuilder) => {
                //     editbuilder.replace(new Range(0, 0, window.activeTextEditor.document.lineCount - 1, window.activeTextEditor.document.lineAt(window.activeTextEditor.document.lineCount - 1).text.length), createHeader(error instanceof NoHeaderError ? {
                //         source: "unknown", modularity: "Ambient", requestOptions: {}
                //     } : header));
                // });
                // log.Info("Created header");
                // commands.executeCommand("editor.action.formatDocument").then(() => log.Info("Finished"));
            }
        });
    }
    exports.updateProxy = updateProxy;
});
// createProxy();
define("cli", ["require", "exports", "main", "minimist"], function (require, exports, main_1, minimist) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const args = minimist(process.argv.slice(2), {
        string: ['outDir', 'endpoint']
    });
    main_1.createProxy(args);
});
define("edmTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("odataCrawler", ["require", "exports", "helper"], function (require, exports, helper_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getEdmTypes(schema, generatorSettings) {
        let metadata = {
            Header: "",
            EntityTypes: [],
            ComplexTypes: [],
            EnumTypes: [],
        };
        if (schema.EntityType) {
            for (let type of schema.EntityType) {
                const p = helper_4.getEntityTypeInterface(type, schema);
                metadata.EntityTypes.push(p);
            }
        }
        if (schema.ComplexType) {
            for (let type of schema.ComplexType) {
                const p = {
                    Namespace: schema.$.Namespace,
                    Fullname: schema.$.Namespace + "." + type.$.Name,
                    Name: type.$.Name,
                    Properties: [],
                    BaseTypeFullName: type.$.BaseType || undefined,
                    OpenType: type.$.OpenType || false,
                };
                if (type.Property)
                    for (let prop of type.Property)
                        p.Properties.push({
                            Name: prop.$.Name,
                            Type: helper_4.getType(prop.$.Type),
                            Nullable: prop.$.Nullable ? (prop.$.Nullable == "true" ? true : false) : true,
                        });
                metadata.ComplexTypes.push(p);
            }
        }
        if (schema.EnumType) {
            for (let enumtype of schema.EnumType) {
                const p = {
                    Name: enumtype.$.Name,
                    Members: [],
                };
                for (const member of enumtype.Member) {
                    p.Members.push({
                        Key: member.$.Name,
                        Value: member.$.Value,
                    });
                }
                metadata.EnumTypes.push(p);
            }
        }
        return metadata;
    }
    exports.getEdmTypes = getEdmTypes;
    function getProperty(inprop, forceoptional) {
        let prop = inprop;
        return prop.$.Name + (typeof prop.$.Nullable !== 'undefined' ? (forceoptional ? "?" : (prop.$.Nullable ? "" : "?")) : "?") + ": " + helper_4.getType(prop.$.Type) + ";\n";
    }
});
//# sourceMappingURL=odatatool.js.map