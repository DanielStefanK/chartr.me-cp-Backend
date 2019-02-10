const { forwardTo } = require('prisma-binding');

const tempalte = {
  async templates(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    return forwardTo('db')(parent, args, ctx, info);
  },
  async template(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    return ctx.db.query.template({ where: { id: args.id } }, info);
  },
};

module.exports = tempalte;
