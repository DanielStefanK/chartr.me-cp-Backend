const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user = {
  async signup(parent, args, ctx) {
    args.email = args.email.toLowerCase();
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

  async signin(parent, { email, password }, ctx) {
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
