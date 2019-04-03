const Joi = require('joi');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const interview = {
  async createInterview(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }
    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const from = moment(Date.now());
    const to = moment(args.data.activeUntil);

    const price = Math.max(
      10,
      Math.round(
        (1 / 30) * to.diff(from, 'days') * ((args.data.limit || 1) * 0.1),
      ),
    );

    const newCredits = ctx.user.company.credits - price;

    if (newCredits < 0) {
      throw new Error('Not enough credits');
    }

    const interview = await ctx.db.mutation.createInterview(
      {
        data: {
          ...args.data,
          creator: {
            connect: {
              id: ctx.user.id,
            },
          },
          company: {
            connect: {
              id: ctx.user.company.id,
            },
          },
        },
      },
      '{id}',
    );

    const updatedCompany = await ctx.db.mutation.updateCompany(
      {
        data: { credits: newCredits },
        where: { id: ctx.user.company.id },
      },
      '{credits}',
    );

    return {
      id: interview.id,
      newBalance: newCredits,
    };
  },
};

module.exports = interview;
