const Joi = require('joi');
const bcrypt = require('bcryptjs');

const template = {
  async createTemplate(parent, args, ctx, info) {
    if (!ctx.user && ctx.user.permissions.includes('ADMIN')) {
      throw new Error('not authenticated');
    }

    return ctx.db.mutation.createTemplate({ data: args.data }, info);
  },
};

module.exports = template;
