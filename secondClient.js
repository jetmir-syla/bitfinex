const Grenache = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const PeerClient = Grenache.PeerRPCClient;
const PeerServer = Grenache.PeerRPCServer;
const _ = require("lodash");
const matchOrders = require("./match");
const config = require("./helper/globalParameter");

let orderBook = {
  buy: [],
  sell: []
};
async function startServer() {
  await createServer();
}

async function createServer() {
  const link = new Link({
    grape: "http://127.0.0.1:30001"
  });
  link.start();

  const peerServer = new PeerServer(link, {
    timeout: 300000
  });
  peerServer.init();

  const service = peerServer.transport("server");
  service.listen(2002);

  setInterval(function() {
    link.announce("second_server", service.port, {});
  }, 1000);

  service.on("request", async (rid, key, order, handler) => {
    console.log("Received order:", order);
    const result = await matchOrders(order, orderBook);
    handler.reply(null, result);
  });
}

startServer();

const link = new Link({
  grape: "http://127.0.0.1:30001"
});
link.start();

const peerClient = new PeerClient(link, {});
peerClient.init();

function sendOrderToServer(order, serverName) {
  peerClient.request(serverName, order, { timeout: 10000 }, (err, response) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    orderBook = response;
    console.log(JSON.stringify(orderBook));
  });
}

const sellOrder = { type: "sell", price: 405, quantity: 3 };

const time = config.myParameter === "0" ? 30000 : 0;
setTimeout(function() {
  sendOrderToServer(sellOrder, "first_server");
  sendOrderToServer(sellOrder, "third_server");
  config.updateParameter(1);
}, time);
