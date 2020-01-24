const { readdirSync } = require('fs');
const { basename, join } = require('path');
const { sync: isDir } = require('is-directory');

const isPng = fp => !!/\.png$/i.test(fp);

const isSpriteDir = dir => fp => isDir(join(dir, fp));

const hasPngInSpriteDir = dir => fp => {
    const file = join(dir, fp);

    return !isDir(file) && isPng(file);
};

const hasIconsInSpriteDir = (dir, spritesPath) => fp => {
    const folder = join(dir, fp);

    if (!isDir(folder)) {
        return false;
    }

    const files = readdirSync(folder);

    if (!files.length) {
        console.warn(`[sprites] Put icons to '${spritesPath}/${basename(folder)}' or delete this folder.`);

        return false;
    }

    return !!files.filter(hasPngInSpriteDir(folder)).length;
};

module.exports = (cwd = process.cwd(), spritesPath = 'app/sprites') => {
    const dir = join(cwd, spritesPath);
    const hasSpritesDir = isDir(dir);

    if (!hasSpritesDir) {
        return false;
    }

    const spritesDirFiles = readdirSync(dir);
    const hasIconsInSpritesDir = !!spritesDirFiles.filter(isPng).length;

    if (hasIconsInSpritesDir) {
        console.warn(`[sprites] Move icons from '${spritesPath}' to '${spritesPath}/<name>' or delete them.`);

        return false;
    }

    return !!spritesDirFiles.filter(hasIconsInSpriteDir(dir, spritesPath)).length;
};
