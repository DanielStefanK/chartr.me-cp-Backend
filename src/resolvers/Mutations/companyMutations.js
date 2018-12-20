const Joi = require('joi');
const bcrypt = require('bcryptjs');

const company = {
  async createOwnCompany(parent, args, ctx, info) {
    if (!ctx.user) {
      throw new Error('not authenticated');
    }
    if (ctx.user.company.id) {
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

    console.log(employees);

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
};

module.exports = company;
