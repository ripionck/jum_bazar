const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        return { error: 'An error occurred while hashing the password.' };
    }
};

const comparePassword = async (password, hashedPassword) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, comparePassword };
