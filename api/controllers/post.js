import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  console.log("req.query", req.body);

  console.log("token", token);

  console.log("userId", userId);

  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  // jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json(data);
    });
  });
};
///////////////////////////////////////////// ADD POST CODE ////////////////////////////


export const addPost = (req, res) => {
  console.log("req.body", req.body);
  const userId = req.query.userId;
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    const q =
      "INSERT INTO posts(`desc`, `img`, `userId`, `createdAt`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      // req.body.userId,
      userInfo.id,
      moment(Date.now()).format("YY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err) => {
      console.log("value",values);
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json("Post has been created");
    });
  });
};
