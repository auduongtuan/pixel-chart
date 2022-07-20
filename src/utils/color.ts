const rgb2hex = (orig: any) => {
  // const a, isPercent,
  const rgb = orig
    .replace(/\s/g, '')
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  const alpha = ((rgb && rgb[4]) || '').trim();
  const hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
      (rgb[2] | (1 << 8)).toString(16).slice(1) +
      (rgb[3] | (1 << 8)).toString(16).slice(1)
    : orig;
  // let a: any;

  // if (alpha !== '') {
  //   a = alpha;
  // } else {
  //   a = 1;
  // }
  // // multiply before convert to HEX
  // a = ((a * 255) | (1 << 8)).toString(16).slice(1);
  // hex = hex + a;

  return hex;
};

const hexToRgba = (hex: string, opacity: number | string = 1) => {
  let bigint, r, g, b, a;
  //Remove # character
  const re = /^#?/;
  const aRgb = hex.replace(re, '');
  if (aRgb.length == 3) {
    bigint = parseInt(aRgb, 16);
    r = (bigint >> 4) & 255;
    g = (bigint >> 2) & 255;
    b = bigint & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }
  if (aRgb.length == 6) {
    bigint = parseInt(aRgb, 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }
  // if (aRgb.length == 8) {
  //   bigint = parseInt(aRgb, 16);
  //   a = ((bigint >> 24) & 255) / 255;
  //   r = (bigint >> 16) & 255;
  //   g = (bigint >> 8) & 255;
  //   b = bigint & 255;
  //   return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(1) + ')';
  // }
};

export default rgb2hex;
export { hexToRgba };
