const db = require("../config/db"); 
const bcrypt = require("bcrypt");

// Register User Controller
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error", error });
  }
};

//Login Controller
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (!user || user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare hashed password (assuming bcrypt is used)
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Remove password before sending response
        const { password: _, ...userData } = user[0];

        res.json({
            message: "Login successful",
            user: userData,  
        });
    } catch (error) {
        console.error(" Error logging in:", error);
        res.status(500).json({ message: "Server error", error });
    }
  };
//create a post 
  exports.createPost = (req, res) => {
    console.log("🔹 Received Body:", req.body);
    console.log("🔹 Received File:", req.file);

    const { user_id ,content } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required!" });
    }

    db.query("INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)", 
      [user_id, content, image_url],  (err, result) => {
      if (err) {
        console.error(" Database error:", err);
        return res.status(500).json({ success: false, message: "Database error!", error: err });
      }

      console.log(" Post created:", { post_id: result.insertId, image_url });
      return res.status(201).json({
        success: true,
        message: "Post created successfully!",
        post_id: result.insertId,
        content,
        image_url,
      });
    });
};
//get all the post
exports.getPosts = async (req, res) => {
    try {
        // Fetch all posts
        const [posts] = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
    
        // Fetch comments for each post
        for (let post of posts) {
          const [comments] = await db.query("SELECT * FROM comments WHERE post_id = ?", [post.id]);
          post.comments = comments; 
        }
    
        return res.status(200).json(posts);
      } catch (err) {
        console.error(" Error fetching posts:", err);
        return res.status(500).json({ success: false, message: "Database error!", error: err });
      }
  };
//post the comments
  exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, comment } = req.body;

        if (!comment.trim()) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        // Insert comment into the database
        const [result] = await db.query(
            "INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)",
            [postId, userId, comment]
        );

        if (result.affectedRows > 0) {
            // Fetch updated comments
            const [updatedComments] = await db.query("SELECT * FROM comments WHERE post_id = ?", [postId]);

            return res.status(200).json({
                success: true,
                message: "Comment added successfully!",
                comments: updatedComments, 
            });
        } else {
            return res.status(500).json({ success: false, message: "Failed to add comment." });
        }
    } catch (err) {
        console.error(" Error adding comment:", err);
        return res.status(500).json({ success: false, message: "Database error!", error: err });
    }
};
//add the likes
exports.toggleLike = async (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ success: false, message: "User ID and Post ID are required!" });
    }

    try {
        // Check if the like already exists
        const [existingLike] = await db.query("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [userId, postId]);

        if (existingLike.length > 0) {
            
            await db.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [userId, postId]);
            return res.status(200).json({ success: true, message: "Post unliked successfully!" });
        } else {
           
            await db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
            return res.status(200).json({ success: true, message: "Post liked successfully!" });
        }
    } catch (error) {
        console.error(" Error toggling like:", error);
        return res.status(500).json({ success: false, message: "Database error!", error });
    }
};
