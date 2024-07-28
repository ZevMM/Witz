const fs = require("fs");
const { parse } = require("csv-parse");
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    //db.run('DROP TABLE ETFs', (err) => console.log(err))
    //ALTER TABLE {tableName} ADD COLUMN COLNew {type}; 
    db.run('CREATE TABLE IF NOT EXISTS currency(Date date,AUD number,CNY number,EUR number,GBP number,HKD number,INR number,JPY number,NZD number)', function(err) {
        if (err) {
            console.log(err.message)
            return
        }
        fs.createReadStream("./currency.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
        db.run(`INSERT INTO currency(Date,AUD,CNY,EUR,GBP,HKD,INR,JPY,NZD) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, row, function(err) {
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
});


/*
let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all("SELECT * FROM realEstate ORDER BY DATE", (err, rows) => {
       rows.forEach(r => console.log(r))
})
    //db.all("SELECT name FROM PRAGMA_TABLE_INFO('monthlyStock');", (err, rows) => console.log(rows) )

    //db.all(`SELECT AAPL, NVDA, SP500, DJIA FROM monthlyStock INNER JOIN indices ON monthlyStock.date = indices.DATE `, function(err, rows) {  
    //    rows.forEach(function (row) {  
    //        console.log(row);
    //    })  
    //});
})*/
