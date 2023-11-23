let serverPort = 8080;
let webSocketPort = 6436;

let express = require("express");
let path = require("path");
let server = express();
let cors = require("cors");
let http = require("http");
let socketIo = require("socket.io");

server.use(cors());
server.disable("x-powered-by"); // security risk

let webSocketServer = http.createServer();
let io = socketIo(webSocketServer);

io.on("connection", function (socket) {
    // When a connection is received, emit a "confirm
    // connection" event to the client.
    socket.emit("confirm connection", "[WS] Connected to WebSocket");
    socket.on("send message", function (msg) {
        console.log("Received message '"+msg+"'");
        socket.broadcast.emit("send message", msg);
    });
});

webSocketServer.listen(webSocketPort, () => {
    console.log("Listening on "+webSocketPort);
});

server.get("/status", function(request, response) {
    response.send('{"status":200}');
});

server.set("views", path.join(__dirname, "/views"));
server.set("view engine", "ejs");
server.engine('ejs', require('ejs').__express);

server.listen(serverPort, function() {
    console.log("Listening on " + serverPort);
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lewismilburn:zuqjon-muwwos-hiCma0@ws7.ksfbcsx.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);