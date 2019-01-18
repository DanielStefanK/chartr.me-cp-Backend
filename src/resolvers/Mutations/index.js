const userMutations = require('./userMutations');
const companyMutations = require('./companyMutations');
const templateMutations = require('./templateMutations');

const mutations = {
  ...userMutations,
  ...companyMutations,
  ...templateMutations,
};

module.exports = mutations;
