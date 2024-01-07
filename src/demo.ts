import bcrypt from "bcrypt";

const demo = async () => {
  const password = "123456";

  const hash1 = await bcrypt.hash(password, 12);
  const hash2 = await bcrypt.hash(password, 12);
};

demo();
