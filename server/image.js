const jimp = require('jimp');

const colors = [
  0x000000ff,
  0xf44336ff,
  0x3f51b5ff,
  0x2196f3ff,
  0x4caf50ff,
  0x009688ff,
  0x795548ff,
  0x607d8bff,
  0xff5722ff,
  0xffc107ff,
  0x9c27b0ff
];

const bitmaps = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]
]

const width = 8;
const height = 8;
const pixel_width = 90;
function generateRandomImage(path, reverse=1) {
  return new Promise((resolve) => {
    const fr_color = 0xffffffff;
    const bg_color = colors[parseInt(Math.random() *  colors.length)];
    const bitmap  = bitmaps[parseInt(Math.random() * bitmaps.length)];
    
    const image = new jimp(width * pixel_width, height * pixel_width, function(err, image) {
      if (err) {
        console.error(err.message);
        throw err;
      }

      for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
          for (let x = 0; x < pixel_width; ++x) {
            for (let y = 0; y < pixel_width; ++y) {
              image.setPixelColor((bitmap[i][j] ^ reverse ? fr_color : bg_color), j * pixel_width + x, i * pixel_width + y);
            }
          }
        }
      }

      image.write(path);
      resolve(true)
    });
  })
}



module.exports = ({
  generateRandomImage
});