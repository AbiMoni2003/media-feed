const express = require("express");
const multer = require("multer");
const {registerUser,loginUser,createPost,getPosts,addComment,toggleLike,getUserPosts}=require("../controllers/authController");

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/posts", upload.single("image"), createPost);


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/posts", upload.single("image"), createPost);
router.get("/posts", getPosts); 
router.post("/posts/:postId/comment", addComment);
router.post("/like", toggleLike);
router.get("/posts/user/:userId", getUserPosts);


module.exports = router;
