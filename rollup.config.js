import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.cjs,
      exports: 'default',
    },
    {
      format: 'amd',
      file: pkg.browser,
    },
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript({
      // eslint-disable-next-line global-require
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
        },
      },
      useTsconfigDeclarationDir: true,
    }),
    terser(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      namedExports: {
        'node_modules/lodash/index.js': ['isPlainObject'],
      },
    }),
  ],
};
