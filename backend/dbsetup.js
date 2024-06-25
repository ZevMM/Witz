const fs = require("fs");
const { parse } = require("csv-parse");
const sqlite3 = require('sqlite3').verbose();
/*
let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }   
    fs.createReadStream("./asset-values.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
    db.run(`INSERT INTO stockprices(Date, AAPL,AMZN,GOOG,META,MSFT,NVDA,TSLA ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, row, function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    })
    .on("end", function () {
    console.log("finished");
    db.close();
    })
    .on("error", function (error) {
    console.log(error.message);
    db.close();
    });
});

//db.run('CREATE TABLE stockprices(Date date, AAPL number,AMZN number,GOOG number,META number,MSFT number,NVDA number,TSLA number)');
*/


let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT * FROM stockprices", function(err, rows) {  
        rows.forEach(function (row) {  
            console.log(row.Date, row.AAPL);    // and other columns, if desired
        })  
    });
})
