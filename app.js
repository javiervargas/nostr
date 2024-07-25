const express = require('express');
const bodyParser = require('body-parser');
const { generatePrivateKey, getPublicKey } = require('nostr-tools');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Simulated database to store user information
const users = new Map();

app.get('/', (req, res) => {
  res.send('Welcome to the Relay Interaction App');
});

app.post('/register', (req, res) => {
  const privateKey = generatePrivateKey();
  const publicKey = getPublicKey(privateKey);

  // Simulated user registration (do not save private keys in real applications)
  users.set(publicKey, privateKey);

  res.json({ publicKey });
});

app.post('/login', (req, res) => {
  const { publicKey, signature, message } = req.body;
  const privateKey = users.get(publicKey);

  if (!privateKey) {
    return res.status(401).send('Invalid public key');
  }

  try {
    // Verify the user's signature
    const verified = verifySignature(message, signature, publicKey);
    
    if (verified) {
      // Signature is valid, login the user
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid signature');
    }
  } catch (error) {
    res.status(500).send('Error verifying signature');
  }
});

function verifySignature(message, signature, publicKey) {
  const { verifyMessage } = require('nostr-tools');
  // Replace 'YOUR_API_KEY' with your actual API key
  const apiKey = 'YOUR_API_KEY';
  
  try {
    const result = verifyMessage({ message, signature, publicKey, apiKey });
    return result.verified;
  } catch (error) {
    return false;
  }
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
