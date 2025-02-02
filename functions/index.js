// Make sure you DEPLOY function after changing this script.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const cors = require('cors')({
  origin: [
    'http://localhost:4000',
    'https://gaba-tope.github.io'
  ],
}); 
//const cors = require('cors')({ origin: 'http://localhost:4000' }); // Replace with your Jekyll site's origin

admin.initializeApp();

exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
  const configFilePath = path.join(__dirname, 'firebase-config.json'); 
  try {
    cors(req, res, () => {
        const configData = fs.readFileSync(configFilePath, 'utf8');
        res.json(JSON.parse(configData));
      });
    //const configData = fs.readFileSync(configFilePath, 'utf8');
    //res.json(JSON.parse(configData)); 
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).send('Error reading configuration');
  }
});