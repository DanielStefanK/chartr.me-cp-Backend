const userQueries = require('./userQueries');
const companyQueries = require('./companyQueries');
const interviewQueries = require('./interviewQueries');
const templateQueries = require('./templateQueries');

const queries = {
  ...userQueries,
  ...companyQueries,
  ...interviewQueries,
  ...templateQueries,
};

module.exports = queries;
