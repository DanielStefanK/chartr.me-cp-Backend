const userMutations = require('./userMutations');
const companyMutations = require('./companyMutations');

const mutations = {
  ...userMutations,
  ...companyMutations,
};

module.exports = mutations;
