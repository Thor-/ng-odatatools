import {
    GeneratorSettings,
    getEntityTypeInterface,
    getType
} from './helper';

import { IODataEntities, IEntityType, IComplexType, IEnum } from './outtypes'


type Partial<T> = {[P in keyof T]?: T[P]}

export function getEdmTypes(schema: Schema, generatorSettings: GeneratorSettings): IODataEntities {
    let metadata: IODataEntities = {
        Header: "",
        EntityTypes: [],
        ComplexTypes: [],
        EnumTypes: [],
    };

    if (schema.EntityType) {
        for (let type of schema.EntityType) {
            const p = getEntityTypeInterface(type, schema);
            metadata.EntityTypes.push(p as IEntityType);
        }
    }
    if (schema.ComplexType) {
        for (let type of schema.ComplexType) {
            const p: IComplexType = {
                Namespace: schema.$.Namespace,
                Fullname: schema.$.Namespace + "." + type.$.Name,
                Name: type.$.Name,
                Properties: [],
                BaseTypeFullName: type.$.BaseType || undefined,
                OpenType: type.$.OpenType || false,
            }
            if (type.Property)
                for (let prop of type.Property)
                    p.Properties.push({
                        Name: prop.$.Name,
                        Type: getType(prop.$.Type),
                        Nullable: prop.$.Nullable ? (prop.$.Nullable == "true" ? true : false) : true,
                    });
            metadata.ComplexTypes.push(p);
        }
    }
    if (schema.EnumType) {
        for (let enumtype of schema.EnumType) {
            const p: IEnum = {
                Name: enumtype.$.Name,
                Members: [],
            }
            for (const member of enumtype.Member) {
                p.Members.push({
                    Key: member.$.Name,
                    Value: member.$.Value,
                })
            }
            metadata.EnumTypes.push(p);
        }
    }
    return metadata;
}

function getProperty(inprop: Property | NavigationProperty, forceoptional?: boolean) {
    let prop = inprop as Property;
    return prop.$.Name + (typeof prop.$.Nullable !== 'undefined' ? (forceoptional ? "?" : (prop.$.Nullable ? "" : "?")) : "?") + ": " + getType(prop.$.Type) + ";\n"
}