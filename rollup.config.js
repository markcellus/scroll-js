import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default function (commandOptions) {
    const distPath = commandOptions.watch ? 'examples/dist' : 'dist';
    return [
        {
            input: 'src/scroll.ts',
            output: {
                format: 'esm',
                file: `${distPath}/scroll.js`,
            },
            plugins: [typescript()],
            watch: {
                include: 'src/**',
            },
        },
        {
            input: `${distPath}/scroll.js`,
            output: {
                format: 'umd',
                name: 'Scroll',
                file: `${distPath}/scroll.common.js`,
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
            input: `${distPath}/scroll.js`,
            output: {
                format: 'esm',
                file: `${distPath}/scroll.min.js`,
            },
            plugins: [
                terser({
                    compress: true,
                    mangle: true,
                }),
                commandOptions.watch &&
                    serve({
                        open: true,
                        historyApiFallback: true,
                        contentBase: 'examples',
                        port: 9383,
                    }),
            ],
        },
    ];
}
