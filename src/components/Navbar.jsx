import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Social Media Feed
        </Typography>

        <Button component={RouterLink} to="/login" color="inherit">
          Login
        </Button>
        <Button component={RouterLink} to="/" color="inherit">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
