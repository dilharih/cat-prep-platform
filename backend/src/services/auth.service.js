function loginUser(data) {
  return {
    success: true,
    message: "Login endpoint working",
    user: {
      email: data.email,
    },
  };
}

module.exports = {
  loginUser,
};