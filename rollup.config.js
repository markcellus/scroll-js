import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const basePlugins = [typescript()];
const commonJSPlugins = [...basePlugins, commonjs()];

export default [
    {
        input: 'src/scroll.ts',
        output: {
            format: 'esm',
            file: 'dist/scroll.js',
        },
        plugins: basePlugins,
        watch: {
            include: 'src/**',
        },
    },
    {
        input: 'src/scroll.ts',
        output: {
            format: 'cjs',
            file: 'dist/scroll.common.js',
        },
        plugins: commonJSPlugins,
        watch: {
            include: 'src/**',
        },
    },
    {
        input: 'src/scroll.ts',
        output: {
            format: 'esm',
            file: 'dist/scroll.min.js',
        },
        plugins: [
            ...commonJSPlugins,
            terser({
                compress: true,
                mangle: true,
            }),
        ],
    },
];
