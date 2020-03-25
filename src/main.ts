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
        // window.showErrorMessage("Could not create proxy. See output window for detail.");
        // log.Error("Creating proxy returned following error:");
        if (error.originalStack) {}
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
}

// createProxy();