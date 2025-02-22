import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handlePostSubmit = async (e) => {
  

    if (!content.trim() || !image) {
      alert("Please add content and an image!");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", "1");
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/auth/posts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      console.log(" Post Created:", data);
      onPostCreated({ ...data, comments: [] }); 
      setContent("");
      setImage(null);
    } catch (error) {
      console.error(" Error:", error);
    
    }
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <TextField
        fullWidth
        label="Write a post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginBottom: "10px" }} />
      <Button type="submit" variant="contained" color="primary" fullWidth>Post</Button>
    </form>
  );
};

export default PostForm;
