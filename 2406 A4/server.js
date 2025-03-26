

const express = require('express'); 
const https = require('https'); 
const PORT = process.env.PORT || 3000; 

const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));

// Routes
app.get(['/mytunes.html','/mytunes', '/index.html', '/'], (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route to fetch songs from iTunes API
app.get('/search', (req, res) => {
  let songTitle = req.query.song;
  if (!songTitle) {
    return res.status(400).json({ error: 'Please provide a song name' });
  }

  let encodedTitle = encodeURIComponent(songTitle);
  let options = {
    method: "GET",
    hostname: "itunes.apple.com",
    path: `/search?term=${encodedTitle}&entity=musicTrack&limit=20`,
    headers: { "useQueryString": true }
  };

  // Create the actual HTTP request and set up its handlers
  https.request(options, function(apiResponse) {
    let songData = '';
    apiResponse.on('data', function(chunk) {
      songData += chunk;
    });
    apiResponse.on('end', function() {
      try {
        const parsedData = JSON.parse(songData)
        res.json(parsedData);
      } catch(error) {
        res.status(500).json({ error: 'Failed to parse API response'})
      }
    });
  }).end(); // End the request to actually send the message
});

// Start server
app.listen(PORT, err => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`To Test: http://localhost:3000`);
    console.log(`http://localhost:3000/mytunes.html`);
    console.log(`http://localhost:3000/mytunes`);
    console.log(`http://localhost:3000/index.html`);
  }
});
