const cheerio = require('cheerio');
const fetch = require('node-fetch');


fetch('https://minecraft-es.gamepedia.com/Fantasma')
  .then(res => {
    if (!res.ok) return;
    return res.text();
  })
  .then(html => {
    const $ = cheerio.load(html);
    const paragraph = $('.mw-parser-output');
    const children = paragraph.children();

    
  })