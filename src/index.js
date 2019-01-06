require('dotenv').config({ path: '.env' });

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { createServer, db } = require('./createServer');

const server = createServer();

// temorary solution only allow cors from frontend url
server.express.use(cors());

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      req.userId = userId;
    }
  }

  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await db.query.user(
    {
      where: { id: req.userId },
    },
    '{id, company {id credits}, deleted, permissions}',
  );

  req.user = user;
  next();
});

server.start(deets => {
  console.log(`Server is now running on port http://localhost:${deets.port}`);
});
