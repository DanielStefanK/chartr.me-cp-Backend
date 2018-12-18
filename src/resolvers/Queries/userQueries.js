const { forwardTo } = require('prisma-binding');

const user = {
  me(parent, args, ctx) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    return ctx.db.query.user({ where: { id: ctx.user.id } });
  },
};

module.exports = user;
