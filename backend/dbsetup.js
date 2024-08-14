const fs = require("fs");
const { parse } = require("csv-parse");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    //ALTER TABLE {tableName} ADD COLUMN COLNew {type}; 
    db.run('CREATE TABLE IF NOT EXISTS bonds(Date date,AAA_Corporate number,BBB_Corporate number,"5yr" number,"10yr" number,"30yr" number)', function(err) {
        if (err) {
            console.log(err.message)
            return
        }
        fs.createReadStream("./Bonds.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
        db.run(`INSERT INTO bonds(Date,AAA_Corporate,BBB_Corporate,"5yr","10yr","30yr") VALUES(?, ?, ?, ?, ?, ?)`, row, function(err) {
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

/*
let db = new sqlite3.Database('asset-values', (err) => {
    db.run(`ALTER TABLE indices DROP COLUMN JPY`, (err) => {
        if (err) {
            console.log(err.message)
            return
        }
        db.get("SELECT * FROM indices ORDER BY DATE", (err, row) =>
            console.log(row))
    })
    
})*/

/*
let db = new sqlite3.Database('asset-values', (err) => {
    db.run(`DELETE FROM crypto WHERE DATE = '2024-07-01'`, (err) => console.log(err))
})
*/
/*
let db = new sqlite3.Database('asset-values', (err) => {
    db.all("SELECT * FROM crypto WHERE Date > '2024-04-01' OR Date < '2019-10-01' ORDER BY DATE", (err, rows) =>
        rows.forEach(r => console.log(r)))
})
*/
/*
let db = new sqlite3.Database('asset-values', (err) => {
    db.run(`ALTER TABLE crypto RENAME COLUMN "DATE" TO Date`, (err) => console.log(err))
})
*/