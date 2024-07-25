# Nostr

## Generating the Nostr Keys

Assuming you already have installed nodejs, lets install the package nostr-tools :

```npm install nostr-tools```

The code is the following:

```javascript
import {generatePrivateKey, getPublicKey} from 'nostr-tools'
let sk = generatePrivateKey() // `sk` is a hex string
let pk = getPublicKey(sk) // `pk` is a hex string
console.log("sk: "+sk)
console.log("pk: "+pk)
```

If you save the code as keys_gen.js, you can run the code as:

node keys_gen.js
something like this is going to show:

sk: 1b74b7d9fbc3404ebbc0889bd171ffb5ffd50820859f459c3cc69c640ae4b57d
pk: d44a780506d239b5b2f2107490e98ef50da11ca71af8ab69848b6d677bd3ead2

The first line is the secret key (SK) and the other one is the public key (PK).

## Fetching data from Nostr relays

Now that we have our keys, lets fetch data posted by a particular PK or user.

```javascript
const WebSocket = require('ws');
// connect to a relay
var ws = new WebSocket("wss://nostr-pub.wellorder.net");
// send a subscription request for text notes from authors with my pubkey
ws.addEventListener('open', function (event) {
 ws.send('["REQ", "my-sub", {"kinds":[1], "authors":["bac24cb2cc510b9ca611dd8ee2f94a1c51192fc25a4a7bf59293d8da77c73766"]}]');
});
// print out all the returned notes
ws.addEventListener('message', function (event) {
 if (JSON.parse(event.data)[2]!=null)
 console.log('Note: ', JSON.parse(event.data)[2]);
});
```

The PK here is bac24cb2cc510b9ca611dd8ee2f94a1c51192fc25a4a7bf59293d8da77c73766 and is a bot that send some trading signal everyday. 
If you save that code as check_posts.cjs you can run it as

node check_posts.cjs
That is the way you can read someones writings, just fetching the posts or notes publish by that PK on that relay.

Note the kinds array contains 1 which the kind of plain text note, similar to Twitter. There are others kinds, you can learn more [here](https://nostrdata.github.io/kinds/).


If we change the PK to your own recently generated PK (remember that you ran node keys_gen.js get that PK) on this example is d44a780506d239b5b2f2107490e98ef50da11ca71af8ab69848b6d677bd3ead2 and run again the check_posts.cjs script you will be waiting for new notes coming from that user, but so far should be none. Just don’t close that terminal, because there we will be checking the new events send by the next code.

## Sending Notes to a Nostr Relay

Now that we are listening to our own notes, we can send a note to that same relay:

```javascript
const nt = require('nostr-tools');
const WebSocket = require('ws');
// connect to a relay
var ws = new WebSocket("wss://nostr-pub.wellorder.net");
let sk = '1b74b7d9fbc3404ebbc0889bd171ffb5ffd50820859f459c3cc69c640ae4b57d'
let pk = nt.getPublicKey(sk)
// send a subscription request for text notes from authors with my pubkey
ws.addEventListener('open', function (e) {
 
 let event = {
 kind: 1,
 pubkey: pk,
 created_at: Math.floor(Date.now() / 1000),
 tags: [],
 content: "Have a nice day!"
 }
event.id = nt.getEventHash(event)
event.sig = nt.getSignature(event, sk)
console.log('["EVENT",'+JSON.stringify(event)+']')
ws.send('["EVENT",'+JSON.stringify(event)+']');
//Closing the websocket connection
ws.close();
 });
```
You have to change the SK hex string with your own SK generated before. Lets save that as send_note.cjs and run it as:

node send_note.cjs
Then we will see the output on the fetching console, running the code from the previous section. Great! That is a simple script.

The first 6 lines are setting up the keys and the connection to the relay wss://nostr-pub.wellorder.net then we add an listener to the web socket connection to be trigger when it opens. The function is the heart of the script and creates the event JSON ( let event ) the event id is created and also the signature and is included as part of the event:

```javascript
event.id = nt.getEventHash(event)
event.sig = nt.getSignature(event, sk)
```

Then the function proceeds to send ws.send and finally closes the connection with the relay ws.close(); .
