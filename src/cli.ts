#!/usr/bin/env node

import { createProxy } from './main';
import * as minimist from 'minimist';

export type CliArguments = {
    outDir?: string;
    endpoint?: string;
  }

const args = minimist<CliArguments>(process.argv.slice(2), {
    string: ['outDir', 'endpoint']
});

createProxy(args);