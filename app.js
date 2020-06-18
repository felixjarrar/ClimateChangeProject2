const fs = require('fs');
const neatCsv = require('neat-csv');

console.log('attempting to read file');
fs.readFile('data.csv', async function(err,contents){
    if (!err) {
        try {
            const data = await neatCsv(contents);
            console.log('file read, now writing new js file');
            fs.writeFile('weatherNY.json', JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } catch (err) {
            console.log(err);
        }
    }
});

const fs = require('fs');
const neatCsv = require('neat-csv');

console.log('attempting to read file');
fs.readFile('gas.csv', async function(err,contents){
    if (!err) {
        try {
            const data = await neatCsv(contents);
            console.log('file read, now writing new js file');
            fs.writeFile('nitrousgas.json', JSON.stringify(gas), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } catch (err) {
            console.log(err);
        }
    }
});