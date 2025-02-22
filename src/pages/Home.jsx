import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, TextField, Button, Typography, IconButton, Box } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import PostForm from "../components/PostForm";

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/posts");
        const data = await response.json();
        console.log("Fetched Posts:", data); 

        setPosts(data.map(post => ({
          ...post,
          comments: post.comments || []
        })));
      } catch (error) {
        console.error(" Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle like toggle
  const handleLikeToggle = async (postId) => {
    const userId = localStorage.getItem("userId"); 

    if (!userId) {
        console.error(" User ID not found in localStorage! Please log in.");
        return;
    }

    try {
        // Send like/unlike request to the backend
        const response = await fetch("http://localhost:5000/api/auth/like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, postId }),
        });

        const data = await response.json();
        console.log(" Like Response:", data);

        if (data.success) {
            // Update local state to reflect the change
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                        : post
                )
            );
        }
    } catch (error) {
        console.error(" Error toggling like:", error);
    }
};



  // Handle adding comments
  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser || !loggedInUser.id) {
        console.error(" Error: User not logged in.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/auth/posts/${postId}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: loggedInUser.id,
                comment: commentText
            }),
        });

        const data = await response.json();
        console.log(" Add Comment Response:", data);

        if (!data.success || !data.comments) {
            throw new Error("Failed to retrieve updated comments");
        }

        // Update the UI with new comments
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, comments: data.comments } : post
        ));
    } catch (error) {
        console.error(" Error adding comment:", error);
    }
};


  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Social Media Feed</Typography>

      {/* Post Form */}
      <PostForm onPostCreated={(newPost) => setPosts([{ ...newPost, comments: [] }, ...posts])} />

      {/* Post Feed */}
      {posts.map(post => (
        <Card key={post.id} sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.user_name}</Typography>
            <Typography>{post.content}</Typography>

            {/* Display Image */}
            <img src={`http://localhost:5000${post.image_url}`} alt="Post" style={{ width: "300px", height: "300px" }} /><br/>


            {/* Like Button */}
            <IconButton onClick={() => handleLikeToggle(post.id)} color={post.liked ? "error" : "default"}>
    {post.liked ? <Favorite /> : <FavoriteBorder />}
</IconButton>
<Typography variant="body2">{post.likes} Likes</Typography>
            {/* Comment Section */}
            <Box mt={2}>
              <Typography variant="subtitle1">Comments:</Typography>
              {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
            <p key={index}>{comment.comment_text}</p>
  ))
) : (
  <p>No comments yet.</p>
)}

            </Box>

            {/* Add Comment Input */}
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment(post.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
