import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { setWallpaper } from 'wallpaper';
import axios from 'axios';
import fs from 'fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function isImg(filePath: string) {
  return (
    /^image\/(png|jpg|jpeg|webp)$/.test(filePath) ||
    filePath.endsWith('.png') ||
    filePath.endsWith('.jpg') ||
    filePath.endsWith('.jpeg') ||
    filePath.endsWith('.webp')
  );
}

// 下载图片
async function downloadImage(url: string, path: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
  //   获取type
  const type = response.headers['content-type'];

  if (type && typeof type === 'string' && !isImg(type)) {
    console.error('请使用jpg/png/jpeg/webp格式的图片');
    process.exit(1);
  }
  fs.writeFileSync(path, response.data);
  return type;
}

async function getWallpaper(wallpaperPath: string) {
  // file:
  if (wallpaperPath.startsWith('file://')) {
    const url = new URL(wallpaperPath);
    wallpaperPath = process.platform === 'win32' ? url.pathname.slice(1) : url.pathname;
  }
  // 本地文件
  if (existsSync(wallpaperPath) && isImg(wallpaperPath)) {
    console.log(wallpaperPath);
    await setWallpaper(wallpaperPath);
    return;
  }

  // 网络文件
  if (wallpaperPath.startsWith('http://') || wallpaperPath.startsWith('https://')) {
    const wallpaperTmp = join(homedir(), 'Pictures', import.meta.env.TSDOWN_APP_NAME, '.tmp');
    if (!existsSync(wallpaperTmp)) {
      mkdirSync(wallpaperTmp, { recursive: true });
    }
    const downloadPath = join(wallpaperTmp, 'wallpaper_' + new Date().getTime());
    const type = await downloadImage(wallpaperPath, downloadPath).catch(e => {
      console.error(e);
      process.exit(1);
    });
    const wallpaper = join(
      wallpaperTmp,
      '..',
      'wallpaper_' +
        new Date().getTime() +
        '.' +
        ((type as string).split('/')[1] === 'jpeg' ? 'jpg' : (type as string).split('/')[1])
    );
    renameSync(downloadPath, wallpaper);
    console.log(wallpaper);

    await setWallpaper(wallpaper);
    return;
  }

  console.error('请使用图片路径或网络图片链接,请使用jpg/png/jpeg/webp格式的图片');
}

export default getWallpaper;
