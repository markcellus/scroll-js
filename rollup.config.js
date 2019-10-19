import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        input: 'src/scroll.ts',
        output: {
            format: 'esm',
            file: 'dist/scroll.js',
        },
        plugins: [typescript()],
        watch: {
            include: 'src/**',
        },
    },
    {
        input: 'dist/scroll.js',
        output: {
            format: 'umd',
            name: 'Scroll',
            file: 'dist/scroll.common.js',
        },
        plugins: [
            resolve({ browser: true }),
            commonjs(),
            babel({
                extensions: ['.js'],
            }),
        ],
    },
    {
        input: 'dist/scroll.js',
        output: {
            format: 'esm',
            file: 'dist/scroll.min.js',
        },
        plugins: [
            terser({
                compress: true,
                mangle: true,
            }),
            process.env.ROLLUP_WATCH &&
                serve({
                    historyApiFallback: true,
                    contentBase: '',
                    port: 9383,
                }),
        ],
    },
];
