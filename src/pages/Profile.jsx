import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) return; // Ensure userId is valid before making a request
  
      try {
        console.log(`Fetching posts for user ID: ${userId}`); // Debugging log
        const response = await axios.get(`http://localhost:5000/api/posts/user/${userId}`);
  
        if (response.status === 200) {
          setPosts(response.data); // Update state if request succeeds
        } else {
          console.warn("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error.response?.data || error.message);
      }
    };
  
    fetchUserPosts(); // Call function immediately
  
  }, [userId]); // Dependency array ensures this runs when userId changes
  // Runs when userId changes

  return (
    <Container>
      <Typography variant="h4">User Profile</Typography>
      <Typography variant="body1">These are your posts:</Typography>

      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} sx={{ margin: "20px 0" }}>
            <CardContent>
              <Typography variant="h6">{post.content}</Typography>
              <Typography variant="body2">Likes: {post.likes}</Typography>
              <Typography variant="body2">Comments: {post.comments.length}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No posts found.</Typography>
      )}
    </Container>
  );
};

export default Profile;
