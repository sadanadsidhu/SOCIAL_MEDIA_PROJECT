import express from "express";

const app = express();
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

/// MIDDLEWARES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentails", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

/////--------------multer----------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /////-----folder name-------------------------- 
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, Date.now() + file.originalname);
  }
})

const upload = multer({ storage: storage });

app.post("/api/upload",upload.single("file"),(req,res)=>{
  const file=req.file;
  res.status(200).json(file.filename)
  console.log("filee",file);
})

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
