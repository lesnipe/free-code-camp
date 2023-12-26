require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
  
  const url = req.body.url;
  
  // Try to find url
  const foundIndex = originalUrls.indexOf(url);
  
  // Validation url
  if(!url.includes("https://") && !url.includes("http://"))
    return res.json({ error: 'invalid url' })
  
  // If already exists -> return it
  if(foundIndex > 0){
    return res.json({ 
      original_url: url,
      short_url: shortUrls[foundIndex]
    })
  }
  
  // If doesn't exist -> push it & return it
  originalUrls.push(url);
  shortUrls.push(shortUrls.length);
  return res.json({
    original_url: url,
    short_url: shortUrls.length - 1
  })
  
})

 app.get('/api/shorturl/:input', (req, res) => {
    const shorturl = parseInt(req.params.input);
    
    // Try to find short url
    const foundIndex = shortUrls.indexOf(shorturl);
    
    // If doesn't exist -> error message
    if(foundIndex < 0) return res.json({ error: "No short URL found for the given input" })
    
    // If it exists -> redirect
    res.redirect(originalUrls[foundIndex]);
    
  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
