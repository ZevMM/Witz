const fs = require("fs");
const { parse } = require("csv-parse");
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('asset-values', (err) => {
    if (err) {
        console.error(err.message);
    }
    //ALTER TABLE {tableName} ADD COLUMN COLNew {type}; 
    db.run('CREATE TABLE IF NOT EXISTS commodities(DATE date,Global_Energy_Prices number,US_Econ_Policy_Uncertainty number,World_Econ_Policy_Uncertainty number,CPI_US number,AMERIBOR number,Overnight_AMERIBOR number,US_30y_Mortgage number,Fed_Funds number,SP500 number,DJIA number,Bacon number,DEXUSEU number,Monetary_Base number,Commericial_Paper_Outstanding number,WEI number,US_Housing_Inventory number,Crude_Oil number,USDX number,JPY number,Nikkei225 number,Russell2000 number,CBOE_Volatility number)', function(err) {
        if (err) {
            console.log(err.message)
            return
        }
        fs.createReadStream("./commodities.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
        db.run(`INSERT INTO commodities(DATE,Global_Energy_Prices,US_Econ_Policy_Uncertainty,World_Econ_Policy_Uncertainty,CPI_US,AMERIBOR,Overnight_AMERIBOR,US_30y_Mortgage,Fed_Funds,SP500,DJIA,Bacon,DEXUSEU,Monetary_Base,Commericial_Paper_Outstanding,WEI,US_Housing_Inventory,Crude_Oil,USDX,JPY,Nikkei225,Russell2000,CBOE_Volatility) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, row, function(err) {
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
    db.run(`ALTER TABLE mutualFunds DROP COLUMN Kinetics_Internet_No_Load`, (err) => {
        if (err) {
            console.log(err.message)
            return
        }
        db.all("SELECT * FROM realEstate ORDER BY DATE", (err, rows) =>
            rows.forEach(r => console.log(r)))
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