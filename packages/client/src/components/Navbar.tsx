import * as React from 'react'
import { styled, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuBookIcon from '@mui/icons-material/MenuBook'

import PersonIcon from '@mui/icons-material/Person'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import AccountCircle from '@mui/icons-material/AccountCircle'
import History from '@mui/icons-material/History'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser, useAppDispatch } from 'store'
import { authApi } from 'modules/auth'
import { appActions } from 'store/appSlice'
import { audiobookPlayerActions } from 'modules/audiobookPlayer'
import { Button } from '@mui/material'

const drawerWidth = 240

interface NavbarProps {
  children: React.ReactNode
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const list = [
  { text: 'Книги', path: '/books', icon: <MenuBookIcon /> },
  {
    text: 'История',
    path: '/history',
    icon: <History />,
    roles: ['USER'],
  },
  { text: 'Авторы', path: '/authors', icon: <PersonIcon />, roles: ['ADMIN'] },
  {
    text: 'Актёры озвучки',
    path: '/voiceActor',
    icon: <KeyboardVoiceIcon />,
    roles: ['ADMIN'],
  },
  {
    text: 'Аудиокниги',
    path: '/audiobooks',
    icon: <AudioFileIcon />,
    roles: ['ADMIN'],
  },
]

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const [isOpen, setIsOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const userRoles = user?.roles?.map(({ name }) => name) || []
  const dispatch = useAppDispatch()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onLogout = () => {
    window.localStorage.removeItem('USER_TOKEN')
    dispatch(appActions.setCurrentUser(null))
    dispatch(audiobookPlayerActions.setAudio(undefined))
    dispatch(audiobookPlayerActions.setAudiobook(undefined))
    dispatch(authApi.util.resetApiState())
    setAnchorEl(null)
    navigate('/login')
  }

  const onLogin = () => {
    setAnchorEl(null)
    navigate('/login')
  }

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={isOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" mr="auto">
            Audio book player
          </Typography>
          <div>
            {user ? (
              <>
                {' '}
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Typography
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {user?.username}
                  </Typography>
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                sx={{
                  color: 'white',
                }}
                onClick={onLogin}
              >
                Войти
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          height: '90vh',
        }}
      >
        <DrawerHeader />
        <List
          sx={{
            height: '90vh',
          }}
        >
          {list.map(({ text, path, icon, roles }) => {
            if (
              roles &&
              !userRoles?.some(
                (userRole) => !!roles.find((role) => role === userRole)
              )
            ) {
              return null
            }
            return (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => navigate(path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  )
}
