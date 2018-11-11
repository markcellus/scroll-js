import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/scroll.ts',
        output: {
            format: 'esm',
            file: 'dist/scroll.js'
        },
        plugins: [resolve(), typescript(), commonjs()],
        watch: {
            include: 'src/**'
        }
    },
    {
        input: 'dist/scroll.js',
        output: {
            format: 'esm',
            file: 'dist/scroll.min.js'
        },
        plugins: [
            terser({
                compress: true,
                mangle: true
            })
        ]
    }
];
