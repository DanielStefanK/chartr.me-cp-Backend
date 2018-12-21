const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const user = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    const schema = Joi.object().keys({
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
    });

    const { error, value } = Joi.validate(
      {
        name: args.name,
        email: args.email,
        password: args.password,
      },
      schema,
    );

    if (error) {
      //TODO: error handling
      throw new Error('Invalid Input');
    }

    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
        },
      },
      '{id, name, email, password, permissions, company {id name}}',
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return { me: user, token: token };
  },

  async login(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    const schema = Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
    });

    const { error, value } = Joi.validate(
      {
        email: args.email,
        password: args.password,
      },
      schema,
    );

    if (error) {
      //TODO: error handling
      throw new Error('Invalid Input');
    }

    const user = await ctx.db.query.user(
      { where: { email: args.email } },
      '{id, name, email, deleted, password, permissions, company {id name}}',
    );

    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }

    if (user.deleted) {
      throw new Error('your account has been deactivated');
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error('Invalid Password!');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return { me: user, token: token };
  },

  async addEmployee(parent, args, ctx, info) {
    // TODO: check permissions
    args.email = args.email.toLowerCase();

    const schema = Joi.object().keys({
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
    });

    const { error, value } = Joi.validate(
      {
        name: args.name,
        email: args.email,
        password: args.password,
      },
      schema,
    );

    if (error) {
      //TODO: error handling
      throw new Error('Invalid Input');
    }

    const password = await bcrypt.hash(args.password, 10);

    return await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          company: { connect: { id: ctx.user.company.id } },
          password,
        },
      },
      info,
    );
  },

  async removeEmployee(parent, args, ctx, info) {
    // TODO: check permissions
    if (!ctx.user) {
      throw new Error('not authenticated');
    }

    const user = await ctx.db.query.user(
      { where: { id: args.id } },
      '{id, deleted company {id}}',
    );

    if (user.company.id !== ctx.user.company.id) {
      throw Error('not authorized');
    }

    const updatedUser = await ctx.db.mutation.updateUser(
      { data: { deleted: true }, where: { id: user.id } },
      info,
    );

    return updatedUser;
  },
};

module.exports = user;
