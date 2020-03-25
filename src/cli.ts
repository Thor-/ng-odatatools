#!/usr/bin/env node

import { createProxy } from './main';
import * as minimist from 'minimist';

type Arguments = {
    outDir?: string;
  }

const args = minimist<Arguments>(process.argv.slice(2), {
    string: 'outDir'
});

console.log('args', args);

createProxy(args.outDir);