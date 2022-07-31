const Sharp = require('sharp');
const { request } = require('undici');

const imageurl = "https://files.yande.re/sample/a34fee4ec98b25d188a0ad829e744203/yande.re%20616101%20sample%20animal_ears%20heterochromia%20kitsune%20komori_aina%20maid%20tail%20wactor%20yushima.jpg"

const main = async () => {
  const arrayBuffer = await request(imageurl).then(response => response.body.arrayBuffer())
  const buffer = Buffer.from(arrayBuffer, 'binary');

  const file = await Sharp(buffer)
    .resize(512, null)
    .jpeg()
    .toFile("./hi.jpg");

  console.log("File has been created");
  console.log("File format:", file.format)
  console.log("Output size:", file.size);
  console.log("Output width and height:", file.width, file.height);
}

main().then(() => console.log("Execution terminated."));
