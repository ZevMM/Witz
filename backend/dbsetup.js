const fs = require("fs");
const { parse } = require("csv-parse");
const sqlite3 = require('sqlite3').verbose();




/*
let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    //ALTER TABLE {tableName} ADD COLUMN COLNew {type}; 
    db.run('CREATE TABLE monthlyStock(Date date,AAPL number,ADBE number,AMZN	number,AVGO	number,CSCO	number,DIS	number,GOOG	number,HD	number,JPM	number,MA	number,META	number,MSFT	number,NFLX	number,NVDA	number,PFE	number,TSLA	number,UNH	number,V number)', function(err) {
        fs.createReadStream("./monthlyStock.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
        db.run(`INSERT INTO monthlyStock(Date,AAPL ,ADBE ,AMZN	,AVGO	,CSCO	,DIS	,GOOG	,HD	,JPM	,MA	,META	,MSFT	,NFLX	,NVDA	,PFE	,TSLA	,UNH	,V ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, row, function(err) {
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
*/




let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all(`SELECT AAPL, NVDA, SP500, DJIA FROM monthlyStock INNER JOIN indices ON monthlyStock.date = indices.DATE `, function(err, rows) {  
        rows.forEach(function (row) {  
            console.log(row);
        })  
    });
})
