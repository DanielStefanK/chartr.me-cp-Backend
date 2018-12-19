const { forwardTo } = require('prisma-binding');

const user = {
  async me(parent, args, ctx) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    const user = await ctx.db.query.user({ where: { id: ctx.user.id } });
    console.log(user);
    return user;
  },

  async checkUser(parent, args, ctx) {
    const user = await ctx.db.query.user({ where: { email: args.email } });
    return !!user;
  },
};

module.exports = user;
