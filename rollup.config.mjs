// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
        file: 'dist/data-anonymizer.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
    },
    {
        file: 'dist/data-anonymizer.es.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};