import * as BlueBird from 'bluebird';

// Configure BlueBird
BlueBird.config({
    warnings: false,
    // longStackTraces: true,
});
// global.Promise = BlueBird;

// Print the stack trace of node warnings // See: http://stackoverflow.com/a/38482688/787757
process.on('warning', (e: any) => console.warn(e.stack));

import { runTest } from './src/test';
runTest();