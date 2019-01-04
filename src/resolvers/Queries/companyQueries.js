const { forwardTo } = require('prisma-binding');

const user = {
  async myCompany(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const company = await ctx.db.query.company(
      { where: { id: ctx.user.company.id } },
      info,
    );
    return company;
  },

  async myEmployees(parent, args, ctx, info) {
    return ctx.db.query.users({
      ...args,
      where: { ...args.where, company: { id: ctx.user.company.id } },
    });
  },
};

module.exports = user;
