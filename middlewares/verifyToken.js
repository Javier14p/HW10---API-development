const admin = require('../firebase');

const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization;
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken) {
            req.user = decodedToken;
            next();
        } else {
            res.status(401).send('Token no válido');
        }
    } catch (error) {
        res.status(500).send('Error al verificar token');
    }
}

module.exports = verifyToken;
