"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
function getEdmTypes(schema, generatorSettings) {
    let metadata = {
        Header: "",
        EntityTypes: [],
        ComplexTypes: [],
        EnumTypes: [],
    };
    if (schema.EntityType) {
        for (let type of schema.EntityType) {
            const p = helper_1.getEntityTypeInterface(type, schema);
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
                BaseTypeNamespace: helper_1.getBaseTypeNamespace(type.$.BaseType),
                OpenType: type.$.OpenType || false,
            };
            if (type.Property)
                for (let prop of type.Property)
                    p.Properties.push({
                        Name: prop.$.Name,
                        Type: helper_1.getType(prop.$.Type),
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
    return prop.$.Name + (typeof prop.$.Nullable !== 'undefined' ? (forceoptional ? "?" : (prop.$.Nullable ? "" : "?")) : "?") + ": " + helper_1.getType(prop.$.Type) + ";\n";
}
