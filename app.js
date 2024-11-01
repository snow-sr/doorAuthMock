const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { logger } = require('./src/middlewares');
const pinoHttp = require('pino-http')({logger});
const { PORT } = require('./src/config');

const mainRouter = require('./src/main');

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


app.use(express.json())
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ['self'],
//           scriptSrc: ['self'],
//           styleSrc: ['self'],
//           objectSrc: ['none'],
//           upgradeInsecureRequests: [],
//         },
//       },
//       dnsPrefetchControl: {allow: false},
//       expectCt: {enforce: true},
//       frameguard: {action: 'deny'},
//       hidePoweredBy: {setTo: 'PHP 4.2.0'},
//       hsts: {maxAge: 5184000, preload: true},
//       ieNoOpen: {setTo: 'false'},
//       noSniff: true,
//       referrerPolicy: {policy: 'strict-origin-when-cross-origin'},
//       xssFilter: true,
//     }),
// );

app.use(cors());
app.use(pinoHttp);
app.use('/api', mainRouter);

app.use('/', (req, res) => {
  res.redirect('/api');
});

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket?.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket?.id}`);
   });
 });
 
exports.io = io;

server.listen(PORT, async () => {
  logger.info(`Server online: http://localhost:${PORT}`);
});
