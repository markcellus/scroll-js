import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/router.ts',
    output: {
        format: 'esm',
        file: 'dist/router.js'
    },
    plugins: [
        resolve(),
        typescript()
    ],
    watch: {
        include: 'src/**'
    }
};