import React, {
  useContext,
  useState,
  FC,
  MouseEventHandler,
} from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  AppBar,
  Button,
  Divider,
  Hidden,
  Link,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Theme,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { SessionContext } from 'components';
import { authService } from 'service';
import Notifications from './components/Notifications';

const { REACT_APP_TITLE } = process.env;

type OpenNavBarMobileHandler = () => void;

export interface TopBarProps {
  className?: string;
  onOpenNavBarMobile?: OpenNavBarMobileHandler;
}

const isWorkWeixin = window.navigator.userAgent.includes('wxwork');

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    boxShadow: 'none',
  },
  toolbar: {
    padding: theme.spacing(0, 1),
  },
  flexGrow: {
    flexGrow: 1,
  },
  brand: {
    color: 'inherit',
    fontWeight: 700,
  },
  logoutButton: {
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(1),
  },
  appBarWorkWeixin: {
    backgroundColor: '#fff',
  },
}));

const TopBar: FC<TopBarProps> = ({
  className = '',
  onOpenNavBarMobile = () => {},
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<any | null>(null);
  const history = useHistory();
  const { session, onClearSession } = useContext(SessionContext);

  const appBarColor = isWorkWeixin ? 'default' : 'primary';

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    onClearSession();
    if (navigator.credentials && navigator.credentials.preventSilentAccess) {
      navigator.credentials.preventSilentAccess();
    }
    await localStorage.removeItem('accessToken');
    history.push('/auth/login');
  };

  return (
    <AppBar
      className={clsx(
        classes.root,
        className,
        {
          [classes.appBarWorkWeixin]: isWorkWeixin,
        },
      )}
      color={appBarColor}
      elevation={isWorkWeixin ? 1 : 0}
    >
      <Toolbar className={classes.toolbar}>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            onClick={onOpenNavBarMobile}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Link
          component={RouterLink}
          to="/"
          underline="none"
          color="inherit"
        >
          <Typography
            variant="h4"
            className={classes.brand}
            noWrap
          >
            {REACT_APP_TITLE}
          </Typography>
        </Link>
        <div className={classes.flexGrow} />
        <Notifications />
        {
          session?.user?.username && (
            <Button
              className={classes.logoutButton}
              color="inherit"
              startIcon={(<AccountCircleIcon />)}
              onClick={handleMenuOpen}
            >
              {session.user.username}
            </Button>
          )
        }
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={RouterLink}
            to="/account"
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <InputIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
