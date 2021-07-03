#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2), {
    string: ['outDir', 'endpoint']
});
main_1.createProxy(args);
