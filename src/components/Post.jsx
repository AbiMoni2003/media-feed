import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{post.user_name}</Typography>
        <Typography>{post.content}</Typography>
        <Typography variant="body2">Likes: {likes}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleLike}>Like</Button>
      </CardActions>
    </Card>
  );
};

export default Post;
