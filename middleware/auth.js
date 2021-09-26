const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "You must be log in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "harshupadhyaya", (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be log in8" + err });
    }
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
