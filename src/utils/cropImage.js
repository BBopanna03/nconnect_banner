export const getCroppedImg = (imageSrc, pixelCrop, width, height) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!imageSrc.startsWith('data:')) {
      image.crossOrigin = 'anonymous';
    }
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw oval mask
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        width / 2,           // center x
        height / 2,          // center y
        width / 2,           // radius x
        height / 2,          // radius y
        0,                   // rotation
        0,                   // start angle
        2 * Math.PI          // end angle
      );
      ctx.closePath();
      ctx.clip();

      // Draw the cropped image inside the oval
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        width,
        height
      );
      ctx.restore();

      // Output as PNG to preserve transparency
      canvas.toBlob(blob => {
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/png');
    };
    image.onerror = reject;
  });
};