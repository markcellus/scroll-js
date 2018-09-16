import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/scroll.ts',
    output: {
        format: 'esm',
        file: 'dist/scroll.js'
    },
    plugins: [
        resolve(),
        typescript()
    ],
    watch: {
        include: 'src/**'
    }
};