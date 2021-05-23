import { config } from 'dotenv';
import { esbuildPlugin } from '@web/dev-server-esbuild';

config();

import { browserstackLauncher } from '@web/test-runner-browserstack';
const sharedCapabilities = {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    name: 'test',
    project: 'scroll-js',
    build: `build ${process.env.GITHUB_RUN_NUMBER || 'unknown'}`,
};

export default {
    files: 'tests/**/*.ts',
    plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
    nodeResolve: true,
    browsers: [
        browserstackLauncher({
            capabilities: {
                ...sharedCapabilities,
                browserName: 'Firefox',
                os: 'OS X',
                os_version: 'Catalina',
            },
        }),

        browserstackLauncher({
            capabilities: {
                ...sharedCapabilities,
                browserName: 'Safari',
                os: 'OS X',
                os_version: 'Catalina',
            },
        }),

        browserstackLauncher({
            capabilities: {
                ...sharedCapabilities,
                browserName: 'iPhone',
                device: 'iPhone 12',
                os_version: '14',
            },
        }),
    ],
};
