import { generateProxy } from './proxyGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateGeneratorSettings, getMetadata } from './helper';
import { CliArguments } from './cli';

export async function createProxy(args: CliArguments) {
    let generatorSettings: TemplateGeneratorSettings = {
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
        const metadata = await getMetadata(maddr);
   
        await generateProxy(metadata, generatorSettings, args);

   
    } catch (error) {
        console.error(error);
    }
}

export async function updateProxy() {
    let header: TemplateGeneratorSettings;
    try {
        // header = getGeneratorSettingsFromDocumentText(window.activeTextEditor.document.getText());

        if (!header) {}
            // return window.showErrorMessage("Could not find valid odatatools header to generate proxy from. Use 'Create Proxy' command instead.");

        if (!header.source) {}
            // return window.showErrorMessage("No source property in odatatools header. Use 'Create Proxy' command instead.");

        // log.Info("Getting Metadata from '" + header.source + "'");
        // const metadata = await getMetadata(header.source, header.requestOptions);

        // generateProxy(metadata, header, getModifiedTemplates());

    } catch (error) {
        console.log(error);
    }
}

// createProxy();