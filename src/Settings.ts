// import * as vscode from 'vscode';
import { LogLevel } from './log';
// import { workspace } from 'vscode';

export type UsageVersion = "0.4" | "1.0" | "2.0";
export class Settings {
    private static get configuration(): any {
        return {}
        // return vscode.workspace.getConfiguration("odatatools");
    }
    static get IsInInsiderMode(): boolean {
        return Settings.configuration.get("insiders", false);
    }

    static get UsageVersion(): UsageVersion {
        return Settings.configuration.get("version", "2.0");
    }

    static get recentlyUsedLength(): number {
        return Settings.configuration.get("recentlyUsedLength", 5);
    }

    static get logLevel(): any {
        return {}
        // return LogLevel[Settings.configuration.get("logLevel", "Info")];
    }
}