import { getSession } from "next-auth/client";
import { verifyPassword, hashPassword } from "../../../lib/auth";
import { connectDatabase } from "../../../lib/db";
async function handler(req, res) {
  if (!req.method === "PATCH") {
    return;
  }
  const session = await getSession({ req: req });
  console.log(session);
  if (!session) {
    res.status(401).json({
      message: "Not authenticated!",
    });
    return;
  }
  const email = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  // verifyPassword
  const client = await connectDatabase();
  const userCollection = client.db().collection("users");
  const existUser = await userCollection.findOne({ email: email });
  if (!existUser) {
    res.status(201).json({
      message: "User is not existed!",
    });
    client.close();
    return;
  }
  // check oldPassword vs currentPassword
  const currentPassword = existUser.password;
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);
  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password" });
  }
  const hashedNewPassword = hashPassword(newPassword);
  const result = await userCollection.updateOne(
    { email: email },
    { $set: { password: hashedNewPassword } }
  );
  client.close();
  res.status(201).json({
    message: "Updated password success",
  });
}
export default handler;
