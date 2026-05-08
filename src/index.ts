#!/usr/bin/env node
import { program } from 'commander';
import pac from '../package.json';
import registry from './registry';
import getWallpaper from './wallpaper';

program
  .name(pac.name)
  .helpOption('-h, --help', '查看帮助')
  .version(pac.version, '-v, --version', '查看版本')
  .arguments('<url>')
  .description(
    `DESCRIPTION: https://github.com/kongxiangyiren/kx-wallpaper`
  )
  .helpCommand(false);

program.parse(process.argv);

if (!process.argv[2]) {
  // 协议判断
  await registry();
} else {
  const url = new URL(process.argv[2]);
  const PROTOCOL = import.meta.env.TSDOWN_PROTOCOL;

  if (url.protocol === PROTOCOL + ':' && url.pathname === '/') {
    const wallpaperPath = url.searchParams.get('p');
    if (!wallpaperPath) {
      console.log('未获取到图片路径');
      process.exit(1);
    }
    await getWallpaper(wallpaperPath);
  } else {
    console.log(`路径错误: ${PROTOCOL}://?p=<图片路径>`);
    process.exit(1);
  }
}
