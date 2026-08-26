import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../contexts/AuthContext';
import { sidebarMenu } from '../constants/sidebarMenu';

const drawerWidth = 240;

const getInitials = (user) => {
  if (!user) return 'GS';
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'GS';
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => { setMobileOpen(false); }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    setProfileAnchor(null);
    logout();
    navigate('/', { replace: true });
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', borderRight: '1px solid #DDE4DE', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(234,241,235,0.9)', filter: 'blur(10px)', top: -80, right: -80, pointerEvents: 'none' }} />
      <Box sx={{ px: 3, pt: 3.5, pb: 3, display: 'flex', alignItems: 'center', gap: 1.75, position: 'relative' }}>
        <Box sx={{ width: 10, height: 34, borderRadius: 1, bgcolor: '#4ADE80', boxShadow: '0 0 18px rgba(74,222,128,0.35)' }} />
        <Typography sx={{ fontWeight: 800, fontSize: '1.18rem', lineHeight: 1.1, color: '#17211D', letterSpacing: '-0.03em' }}>
          GreenSteel
        </Typography>
      </Box>

      <List component="nav" aria-label="Primary navigation" sx={{ px: 2, py: 0, flex: 1, overflowY: 'auto' }}>
        {sidebarMenu.map((section) => (
          <Box key={section.section} sx={{ mb: 3 }}>
            <Typography sx={{
              px: 1.5, mb: 1, color: '#66716A', fontSize: '0.68rem', fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {section.section}
            </Typography>
            {section.items.filter((item) => !item.roles || item.roles.includes(user?.role)).map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={active}
                  sx={{
                    minHeight: 40, mb: 0.5, px: 2, borderRadius: 2,
                    color: active ? '#355E45' : '#17211D',
                    position: 'relative',
                    transition: 'transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease, color 180ms ease',
                    '& .MuiListItemIcon-root': { minWidth: 32, color: 'inherit', fontSize: 20 },
                    '&.Mui-selected': { background: '#EAF1EB', color: '#3F654B', fontWeight: 600, boxShadow: 'none' },
                    '&.Mui-selected::before': { content: '""', position: 'absolute', left: 0, top: 9, bottom: 9, width: 3, borderRadius: 3, bgcolor: '#3F654B' },
                    '&.Mui-selected:hover': { bgcolor: '#EAF1EB', transform: 'translateX(2px)' },
                    '&:hover:not(.Mui-selected)': { bgcolor: '#F5F7F4', color: '#3F654B', transform: 'translateX(2px)' },
                  }}
                >
                  <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 500 }} />
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #DCE2DD', bgcolor: 'rgba(255,255,255,0.68)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, px: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#F5F6F2', color: '#17211D', fontSize: 13, fontWeight: 600, border: '1px solid #DCE2DD' }}>
            {getInitials(user)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#17211D' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
            <Typography noWrap sx={{ fontSize: '0.75rem', color: '#64706A' }}>
              {user?.role?.replace('_', ' ') || 'Role'}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ minHeight: 36, borderRadius: 2, color: '#C94A4A', px: 1.5, '&:hover': { bgcolor: '#fbf0f0' } }}>
          <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },
        bgcolor: '#FFFFFF', color: '#17211D', borderBottom: '1px solid #DCE2DD',
      }}>
        <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, px: { xs: 2.5, sm: 4 }, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { sm: 'none' }, color: '#17211D' }} edge="start">
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="View alerts">
              <IconButton component={Link} to="/alerts" sx={{ color: '#17211D', bgcolor: '#F5F6F2', transition: 'transform 180ms ease, background-color 180ms ease', '&:hover': { bgcolor: '#E8F0EA', transform: 'translateY(-2px)' } }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 1, p: 0.5, borderRadius: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#355E45', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                {getInitials(user)}
              </Avatar>
              <KeyboardArrowDownIcon sx={{ ml: 0.5, color: '#64706A' }} fontSize="small" />
            </IconButton>
            <Menu 
              anchorEl={profileAnchor} 
              open={Boolean(profileAnchor)} 
              onClose={() => setProfileAnchor(null)}
              PaperProps={{ elevation: 0, sx: { mt: 1, minWidth: 200, borderRadius: 2, border: '1px solid #DCE2DD', boxShadow: '0 8px 24px rgba(23,33,29,0.08)' } }}
            >
              <MenuItem disabled sx={{ opacity: '1 !important', color: '#17211D', py: 1.5, borderBottom: '1px solid #DCE2DD', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>{user ? `${user.firstName} ${user.lastName}` : 'Profile'}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#C94A4A', fontWeight: 500, py: 1.5 }}>Sign out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        minWidth: 0,
        overflowX: 'hidden',
        width: { sm: `calc(100% - ${drawerWidth}px)` }, 
        pt: { xs: '60px', sm: '64px' },
        display: 'flex', flexDirection: 'column'
      }}>
        <Box sx={{ flexGrow: 1, minWidth: 0, px: { xs: 2, sm: 4 }, pt: { xs: 2, sm: 2.5 }, pb: { xs: 3, sm: 4 }, width: '100%' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
