export const isAuthenticated = (req, res, next) => {
    if(!req.user) {
        return res.status(401).send({error: 401, message: "You have to be connected to access this ressource"});
    }
    next();
}