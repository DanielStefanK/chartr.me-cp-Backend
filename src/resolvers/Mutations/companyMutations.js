const Joi = require('joi');
const bcrypt = require('bcryptjs');

const company = {
  async createOwnCompany(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }
    if (ctx.user.company && ctx.user.company.id) {
      throw new Error('user already has a company');
    }

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      employees: Joi.array().items(
        Joi.object().keys({
          name: Joi.string()
            .alphanum()
            .min(4)
            .max(30)
            .required(),
          password: Joi.string()
            .min(6)
            .required(),
          email: Joi.string()
            .email({ minDomainAtoms: 2 })
            .required()
            .min(4)
            .max(30),
        }),
      ),
    });

    const { error, value } = Joi.validate(
      {
        name: args.name,
        employees: args.employees,
      },
      schema,
    );

    if (error) {
      //TODO: error handling
      throw new Error('Invalid Input');
    }

    const employees = await Promise.all(
      args.employees.map(async employee => ({
        password: await bcrypt.hash(employee.password, 10),
        name: employee.name,
        email: employee.email,
        permissions: { set: ['USER'] },
      })),
    );

    return ctx.db.mutation.createCompany(
      {
        data: {
          name: args.name,
          contact: { connect: { id: ctx.user.id } },
          employees: {
            create: employees,
            connect: [{ id: ctx.user.id }],
          },
        },
      },
      info,
    );
  },

  async updateOwnCompany(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }
    if (!ctx.user.company) {
      throw new Error('No Company found');
    }

    const schema = Joi.object().keys({
      name: Joi.string(),
    });

    const { error, value } = Joi.validate(
      {
        name: args.name,
      },
      schema,
    );

    if (error) {
      //TODO: error handling
      throw new Error('Invalid Input');
    }

    const currentCompany = await ctx.db.query.company(
      { where: { id: ctx.user.company.id } },
      '{id contact {id}}',
    );

    const updateData = {};

    if (args.name) updateData.name = args.name;
    if (args.contact) {
      const user = await ctx.db.query.user(
        { where: { id: args.contact } },
        '{id company {id}}',
      );

      if (user.company.id != ctx.user.company.id) {
        throw new Error('Invalid Input');
      } else if (args.contact && currentCompany.contact.id != args.contact) {
        updateData.contact = { connect: { id: args.contact } };
      }
    }

    const updatedCompany = ctx.db.mutation.updateCompany(
      {
        data: updateData,
        where: { id: ctx.user.company.id },
      },
      info,
    );

    return updatedCompany;
  },

  // TODO: Real addin credits
  async addCredits(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }
    if (!ctx.user.company) {
      throw new Error('No Company found');
    }
    const creditsToAdd = args.amount * 3;

    const updatedCompany = await ctx.db.mutation.updateCompany(
      {
        data: { credits: ctx.user.company.credits + creditsToAdd },
        where: { id: ctx.user.company.id },
      },
      '{credits}',
    );

    return updatedCompany.credits;
  },
};

module.exports = company;
