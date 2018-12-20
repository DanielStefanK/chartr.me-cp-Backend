const userQueries = require('./userQueries');
const companyQueries = require('./companyQueries');

const queries = {
  ...userQueries,
  ...companyQueries,
};

module.exports = queries;
