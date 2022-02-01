import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MoreIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/system';
import { FaGithub } from 'react-icons/fa';

const Div = styled('div')``;

const MobileMenu = (props) => {
  const { anchorEl, onClose } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={anchorEl !== null}
      onClose={onClose}
    >
      <Button color='inherit' href='/predict' sx={{ display: 'block' }}>
        Predict
      </Button>
      <Button color='inherit' href='/about' sx={{ display: 'block' }}>
        About
      </Button>
      <Button color='inherit' href='/faq' sx={{ display: 'block' }}>
        FAQ
      </Button>
      <Button color='inherit' href='https://datasets.deepcell.org' target='_blank' rel='noopener noreferrer' sx={{ display: 'block' }}>
        Data
      </Button>
      <Button color='inherit' href='https://github.com/vanvalenlab' target='_blank' rel='noopener noreferrer' sx={{ display: 'block' }}>
        <FaGithub size={28} />
      </Button>
    </Menu>
  );
};

MobileMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
};

export default function NavBar() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='subtitle1' color='inherit' sx={{ flexGrow: 1 }}>
            <IconButton color='inherit' href='/' size="large">
              DeepCell
            </IconButton>
          </Typography>
          <Div sx={{ flexGrow: 1 }} />
          <Div sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button color='inherit' href='/predict'>
              Predict
            </Button>
            <Button color='inherit' href='/about'>
              About
            </Button>
            <Button color='inherit' href='/faq'>
              FAQ
            </Button>
            <Button color='inherit' href='https://datasets.deepcell.org' target='_blank' rel='noopener noreferrer'>
              Data
            </Button>
            <Button color='inherit' href='https://github.com/vanvalenlab' target='_blank' rel='noopener noreferrer'>
              <FaGithub size={28} />
            </Button>
          </Div>
          <Div sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              aria-haspopup='true'
              color='inherit'
              onClick={e => setMobileMoreAnchorEl(e.currentTarget) }
              size="large">
              <MoreIcon />
            </IconButton>
          </Div>
        </Toolbar>
      </AppBar>
      <MobileMenu
        anchorEl={mobileMoreAnchorEl}
        onClose={() => setMobileMoreAnchorEl(null)}
      />
    </div>
  );
}
