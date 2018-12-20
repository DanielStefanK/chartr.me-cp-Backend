const { forwardTo } = require('prisma-binding');

const user = {
  async myCompany(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    const company = await ctx.db.query.company(
      { where: { id: ctx.user.company.id } },
      info,
    );
    return company;
  },
};

module.exports = user;
