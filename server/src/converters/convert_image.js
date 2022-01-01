import sharp from 'sharp';

/**
 * @param {Buffer} buffer
 * @param {object} options
 * @param {number} [options.extension]
 * @param {number} [options.height]
 * @param {number} [options.width]
 * @returns {Promise<Uint8Array>}
 */
async function convertImage(buffer, options) {
  const result = sharp(buffer)
    .resize({
      fit: 'cover',
      height: options.height,
      width: options.width,
    })
    .metadata((err, metadata) => {
      const w = metadata.width
      const h = metadata.height
    })
    .toFormat(options.extension ?? 'jpeg')
    .toBuffer();
  return {
    image: result,
    w: w,
    h: h,
  }
}

export { convertImage };
