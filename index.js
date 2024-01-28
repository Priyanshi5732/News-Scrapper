const cheerio = require("cheerio");
const request = require("request");
const mysql = require("mysql2");
const cronitor = require("cronitor")(process.env.Client_key);
const cron = require("node-cron");
const monitor = new cronitor.Monitor('process.env.Monitor_key');
const bodyParser = require('body-parser');
const express =require('express');
const app= express();

app.use(bodyParser.json());

require("dotenv").config(); //.env file that I created

//mysql connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
});
//connecting to my database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});


cron.schedule(
  //scraps everyday at midnight
  "0 0 * * *",
  () => {
    let url = "https://www.sgsits.ac.in/index.php/exam";
    request(url, function (error, response, html) {
      // the job has started
      monitor.ping({state: 'run'});
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        let website_title = $("td.list-title");
        website_title.each((i, div) => {
          const scrapedTitle = $(div).text().trim();

          //inserts scraped data to mysql table "college_news"
          const sql = "INSERT INTO college_news (title) VALUES (?)";
          connection.query(sql, [scrapedTitle], (err, results) => {
            if (err) {
              console.error("Error inserting data: " + err.stack);
              monitor.ping({ state: 'fail' });
              return;
            }
            console.log(
              "Data inserted successfully. Inserted ID:",
              results.insertId
              
            );
            monitor.ping({state: 'complete'});
          });
        });
      }
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set your timezone here
  }
);

//defined API endpoint to get new data by ID
app.get('/api/titles/:id', (req,res)=>{
  const newsId= req.params.id;

  //query the database to get data by ID
  const sql= 'SELECT * FROM college_news where id=?'
  connection.query(sql, [newsId], (err, results) => {
    if (err) {
        console.error('Error retrieving news data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    if (results.length === 0) {
        res.status(404).json({ error: 'Title not found' });
    } else {
        res.json(results[0]); // Assuming the ID is unique,so return the first result
    }
  });
});

//good practice for initialising the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", () => {
  //closes connection after data is inserted
  connection.end();
  process.exit();
});
