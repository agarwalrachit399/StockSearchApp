//Imports
import express, { json } from "express";
import axios from "axios";
import { MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('dist/stock-search/browser'));
app.use(json());
app.use(express.urlencoded({ extended: true }));

var currentDate = new Date()
var currentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
var sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
var twoYearsAgoDate = new Date();
twoYearsAgoDate.setFullYear(twoYearsAgoDate.getFullYear() - 2);
var prevDate  = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`
var twoYearDate =  `${twoYearsAgoDate.getFullYear()}-${String(twoYearsAgoDate.getMonth() + 1).padStart(2, '0')}-${String(twoYearsAgoDate.getDate()).padStart(2, '0')}`
let from
let to 
const finhub_api = process.env.FINHUB_API_KEY
const polygon_api = process.env.POLYGON_API_KEY
const mongo_pass = process.env.MONGO_URI_PASS
//MongoDb connection
const uri = `mongodb+srv://rachit:${mongo_pass}@cluster0.6pmzacg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
var database 
const client = new MongoClient(uri);
client.connect()
database= client.db("WebTech_HW3")

console.log(finhub_api)

//Get current Market Status
async function GetStatusDays(){
 const stockQuote = await axios.get(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finhub_api}`);
  const closingtimestamp = stockQuote.data.t
  const historyDate = new Date(closingtimestamp * 1000)
  const currentDate = new Date()
  const filler = new Date()
  const filler2 = new Date(historyDate)
  const yesterDayDate = new Date(filler.setDate(currentDate.getDate()-1))
  const OneDayBeforeClose = new Date(filler2.setDate(historyDate.getDate()-1))
 if ((currentDate.valueOf() - historyDate.valueOf())/1000 >300){
 from = `${OneDayBeforeClose.getFullYear()}-${String(OneDayBeforeClose.getMonth() + 1).padStart(2, '0')}-${String(OneDayBeforeClose.getDate()).padStart(2, '0')}`
 to = `${historyDate.getFullYear()}-${String(historyDate.getMonth() + 1).padStart(2, '0')}-${String(historyDate.getDate()).padStart(2, '0')}`
}
else {
  from = `${yesterDayDate.getFullYear()}-${String(yesterDayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterDayDate.getDate()).padStart(2, '0')}`
  to = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
}
}
 

//Get all the data for the ticker
app.get("/company", async (req, res) => {
  GetStatusDays()
  const name = req.query.name;
  try {
  const companyProfile = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${name}&token=${finhub_api}`);
  const historicalData = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${name}&token=${finhub_api}`);
  const companyPeers = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${name}&token=${finhub_api}`)
  const hourlyData = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${name}/range/1/hour/${from}/${to}/?adjusted=true&sort=asc&apiKey=${polygon_api}`)
  const newsSummary = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${name}&from=${prevDate}&to=${currentDate}&token=${finhub_api}`)
  const chartData = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${name}/range/1/day/${twoYearDate}/${currentDate}/?adjusted=true&sort=asc&apiKey=${polygon_api}`)
  const insiderSentiment = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${name}&from=2022-01-01&token=${finhub_api}`)
  const recommendationData = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${name}&token=${finhub_api}`)
  const epsearningData = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${name}&token=${finhub_api}`)

  res.status(200).json({
    company: companyProfile.data,
    history: historicalData.data,
    peers: companyPeers.data,
    news: newsSummary.data,
    sentiment: insiderSentiment.data,
    hourlyPrice: hourlyData.data,
    recommendation: recommendationData.data,
    epsearning: epsearningData.data,
    charting: chartData.data
  })} catch (error){
    console.error("Failed to make request",error.message)
    res.status(500).send("Failed to fetch activity. Please try again")
  }
});

//Get stock data which gets refreshed every 15 sec
app.get("/quote", async (req,res)=> {
  const name = req.query.name;
  try {
  const stockQuote = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${name}&token=${finhub_api}`);

  res.status(200).json({
    stock: stockQuote.data
  })
  } catch(error) {
    console.error("Failed to make request",error.message)
    res.status(500).send("Failed to fetch activity. Please try again")
  }
})



// AUTOCOMPLETE
app.get("/tick", async (req, res) => {
  const name = req.query.name;
  try {
    const autocomplete = await axios.get(`https://finnhub.io/api/v1/search?q=${name}&token=${finhub_api}`)
    const autocompleteData = autocomplete.data.result.map(obj=>{
      const {primary, ...rest}=obj;
      return rest
    })
    res.status(200).json({
      autocomplete:autocompleteData
    })} catch (error){
      console.error("Failed to make request",error.message)
      res.status(500).send("Failed to fetch activity. Please try again")
    }
})







//Get Entire Watchlist
app.get('/watchlist', async (req, res) => {
  try {
    const collection = database.collection('WatchList');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//Get Specific Stock from Watchlist
app.get('/watchlist/:ticker', async (req, res) => {
  
  try {
    const ticker = req.params.ticker
    const collection = database.collection('WatchList'); 
    const data = await collection.findOne({ticker : ticker});
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//Save a stock to Watchlist
app.post('/watchlist/save', async (req, res) => {
  try {
   
    const {ticker, name , price , change, percent } = req.body;
    const collection = database.collection('WatchList');
    const result = await collection.insertOne({ ticker,name,price,change,percent });
    res.status(201).json({ message: 'Data saved successfully'});
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


//Delete a stock from Watchlist
app.delete('/delete/:ticker', async (req, res) => {
  try {
    const nameToDelete = req.params.ticker;
    const collection = database.collection('WatchList');
    const result = await collection.deleteOne({ ticker: nameToDelete });

    if (result.deletedCount === 1) {
      res.json({ message: `Record with name '${nameToDelete}' deleted successfully` });
    } else {
      res.status(404).json({ error: `Record with name '${nameToDelete}' not found` });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Get Entire Portfolio
app.get('/portfolio/all', async (req, res) => {
  try {
    const collection = database.collection('Portfolio'); 
    const data = await collection.find({ _id: { $ne: 'money' } }).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


//Get specific stock 
app.get('/portfolio/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const collection = database.collection('Portfolio');
    const data = await collection.findOne({_id: ticker})
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//Get balance
app.get('/portfolio/money', async (req, res) => {
  try {
    const collection = database.collection('Portfolio'); 
    const data = await collection.findOne({ _id: 'money' })
    print(data)
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//Update the Stock in Portfolio
app.put('/portfolio/update/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const update = req.body;
    const collection = database.collection('Portfolio');
    const result = await collection.findOneAndUpdate(
      { _id: ticker },
      { $set: update },
      { returnOriginal: false, upsert: true }
    );

    res.status(201).json({ message: 'Data saved successfully'});
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

//Delete from Portfolio
app.delete('/portfolio/delete/:ticker', async (req, res) => {
  try {
    const nameToDelete = req.params.ticker;
    const collection = database.collection('Portfolio');
    const result = await collection.deleteOne({ _id: nameToDelete });

    if (result.deletedCount === 1) {
      res.json({ message: `Record with name '${nameToDelete}' deleted successfully` });
    } else {
      res.status(404).json({ error: `Record with name '${nameToDelete}' not found` });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  

});



