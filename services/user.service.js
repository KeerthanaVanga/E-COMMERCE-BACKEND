import User from "../models/user.model.js";

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const checkUserLoggedInStatus = async (user) => {
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { isLoggedIn: true },
    { new: true }
  );

  return updatedUser;
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId, { name: 1, email: 1, _id: 0 });
  return user;
};

export {
  findUserByEmail,
  createUser,
  findUserById,
  checkUserLoggedInStatus,
  getUserProfile,
};
