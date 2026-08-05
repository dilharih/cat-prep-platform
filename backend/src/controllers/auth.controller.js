const { loginUser } = require("../services/auth.service");

function login(req, res) {
  const result = loginUser(req.body);

  res.status(200).json(result);
}

module.exports = {
  login,
};