const basicAuth = require('express-basic-auth');

module.exports = (users) => {
    return basicAuth({
        users: users,
        challenge: true,
        unauthorizedResponse: (req) => {
            return `Authentication credentials are invalid.`;
        },
    });
};