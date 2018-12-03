const { forwardTo } = require('prisma-binding');

const user = {
  users: forwardTo('db'),
};

module.exports = user;
