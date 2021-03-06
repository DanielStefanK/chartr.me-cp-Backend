const { forwardTo } = require('prisma-binding');

const interview = {
  async myInterviews(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const interviews = await ctx.db.query.interviews(
      {
        ...args,
        where: { ...args.where, company: { id: ctx.user.company.id } },
      },
      info,
    );
    return interviews;
  },

  async myInterviewsConnection(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const interviewsCon = await ctx.db.query.interviewsConnection(
      {
        ...args,
        where: { ...args.where, company: { id: ctx.user.company.id } },
      },
      info,
    );
    return interviewsCon;
  },

  async interview(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const interviewtemp = await ctx.db.query.interview(
      {
        where: { id: args.id },
      },
      '{company {id}}',
    );

    if (interviewtemp.company.id !== ctx.user.company.id) {
      throw new Error('not authorised');
    }

    return await ctx.db.query.interview(
      {
        where: { id: args.id },
      },
      info,
    );
  },

  async myResults(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const results = await ctx.db.query.results(
      {
        ...args,
        where: { ...args.where, company: { id: ctx.user.company.id } },
      },
      info,
    );
    return results;
  },

  async myResultsConnection(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const resultCon = await ctx.db.query.resultsConnection(
      {
        ...args,
        where: { ...args.where, company: { id: ctx.user.company.id } },
      },
      info,
    );

    return resultCon;
  },

  async result(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const resulttemp = await ctx.db.query.result(
      {
        where: { id: args.id },
      },
      '{company {id}}',
    );

    if (resulttemp.company.id !== ctx.user.company.id) {
      throw new Error('not authorised');
    }

    return await ctx.db.query.result(
      {
        where: { id: args.id },
      },
      info,
    );
  },
};

module.exports = interview;
