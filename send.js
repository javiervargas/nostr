const nt = require('nostr-tools');
const WebSocket = require('ws');
// connect to a relay

// private key 31c05b7c127dab54ff3bbdacc4a5dfd6a18121bab31e5d11926b4c3833e746c5
// public key  f472f1379db1f3c88979c7137999281ca3e8c8e7eef9cfd273d8fb9711cbbce7

var ws = new WebSocket("wss://nostr-pub.wellorder.net");
//let sk = '1b74b7d9fbc3404ebbc0889bd171ffb5ffd50820859f459c3cc69c640ae4b57d'

let sk = '31c05b7c127dab54ff3bbdacc4a5dfd6a18121bab31e5d11926b4c3833e746c5'
let pk = nt.getPublicKey(sk)
// send a subscription request for text notes from authors with my pubkey
ws.addEventListener('open', function (e) {
 
 let event = {
 kind: 1,
 pubkey: pk,
 created_at: Math.floor(Date.now() / 1000),
 tags: [],
 content: "Hola esta es una prueba!"
 }
event.id = nt.getEventHash(event)
event.sig = nt.getSignature(event, sk)
console.log('["EVENT",'+JSON.stringify(event)+']')
ws.send('["EVENT",'+JSON.stringify(event)+']');
//Closing the websocket connection
ws.close();
 
});
