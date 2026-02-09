import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashpass = await bcrypt.hash(password, salt);
    return hashpass;
  } catch (error) {
    console.error("Error hashing password", error);
    throw new Error("Password hashing failed");
  }
};

export const compare = async (password: string, sysPassword: string) => {
  try {
    const matchPassword = await bcrypt.compare(password, sysPassword);
    return matchPassword;
  } catch (error) {
    console.error("Error comparing password", error);
    throw new Error("Password comparison failed");
  }
};
