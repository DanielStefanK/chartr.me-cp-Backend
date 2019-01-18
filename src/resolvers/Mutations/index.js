const userMutations = require('./userMutations');
const companyMutations = require('./companyMutations');
const templateMutations = require('./templateMutations');
const interviewMutations = require('./interviewMutations');

const mutations = {
  ...userMutations,
  ...companyMutations,
  ...templateMutations,
  ...interviewMutations,
};

module.exports = mutations;
