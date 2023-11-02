import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
export default {
  input: './index.js', // 入口文件
  // external: ['fs'], // <-- suppresses the warning
  plugins: [
    commonjs({
      include: /node_modules/
    }),
    json(),
    resolve(),
    terser(),// 打包代码压缩
  ],
  output: {
    file: './out/out.js', // 输出文件
    format: 'es', // 输出格式 amd / es / cjs / iife / umd / system
    name: 'func',  // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    sourcemap: true,  // 生成bundle.js.map文件，方便调试

  }
}