const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const user = {
  async signup(parent, args, ctx) {
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

    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return { me: user, token: token };
  },

  async login(parent, { email, password }, ctx) {
    // TODO: validate user input

    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid Password!');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return { me: user, token: token };
  },
};

module.exports = user;
