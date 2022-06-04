// TODO: tampilkan teks pada notes.txt pada console.
const fs = require('fs');
const path = require('path');

const locText = path.resolve(__dirname, 'notes.txt');

const data = fs.readFileSync(locText, 'UTF-8');

console.log(data);