
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q =
    req.query.postId !== "undefined"
      ? `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC`
      : null; // You should handle the case when postId is undefined

  if (q) {
    db.query(q, [req.query.postId], (err, data) => {
        // console.log("daataaaa",data);
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json(data);
    });
  } else {
    // Handle the case when postId is undefined
    return res.status(400).json({ error: "postId is undefined" });
  }
};

///////////////--------add comments 

export const addComments = (req, res) => {
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
        "INSERT INTO comments(`userId`,`desc`, `createdAt`,postId) VALUES (?)";
      const values = [
        userInfo.id,
        req.body.desc,
        // req.body.userId,
        moment(Date.now()).format("YY-MM-DD HH:mm:ss"),
        req.body.postId,
      ];
  
      db.query(q, [values], (err) => {
        // console.log("vvvvvvvvv",values);
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json("Comment has been created");
      });
    });
  };
