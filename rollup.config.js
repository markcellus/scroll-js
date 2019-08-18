import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

const basePlugins = [typescript()];
const commonJSPlugins = [
    ...basePlugins,
    babel({
        exclude: 'node_modules/**',
        extensions: ['.ts'],
    }),
    commonjs(),
    process.env.ROLLUP_WATCH &&
        serve({
            historyApiFallback: true,
            contentBase: '.',
            port: 9383,
        }),
];

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
