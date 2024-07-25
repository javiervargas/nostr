const { generatePrivateKey, getPublicKey } = require('nostr-tools');

//let sk = generatePrivateKey(); // `sk` is a hex string
//let pk = getPublicKey(sk); // `pk` is a hex string

//console.log(sk);
//console.log(pk);


const WebSocket = require('ws');
// connect to a relay
var ws = new WebSocket("wss://nostr-pub.wellorder.net");
// send a subscription request for text notes from authors with my pubkey
ws.addEventListener('open', function (event) {
 ws.send('["REQ", "my-sub", {"kinds":[1], "authors":["f472f1379db1f3c88979c7137999281ca3e8c8e7eef9cfd273d8fb9711cbbce7"]}]');
});
// print out all the returned notes
ws.addEventListener('message', function (event) {
 if (JSON.parse(event.data)[2]!=null)
 console.log('Note: ', JSON.parse(event.data)[2]);
});
