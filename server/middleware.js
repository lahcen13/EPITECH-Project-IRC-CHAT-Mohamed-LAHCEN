const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const decodedToken = jwt.verify(sessionStorage.getItem("token"), process.env.LYAN);
        const pseudo = decodedToken.pseudo;
        if ( process.env.LYAN !== pseudo) {
            throw 'invalid token ! go away HACKER !!!';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
