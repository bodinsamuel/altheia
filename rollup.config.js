import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
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
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          declaration: false,
          outFile: false,
        },
      },
      useTsconfigDeclarationDir: true,
    }),
    terser(),
  ],
};
