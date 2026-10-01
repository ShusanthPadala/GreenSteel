import { Suspense, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, AppBar, Avatar, Box, Drawer, IconButton, List, ListItemButton, Snackbar,
  ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../contexts/AuthContext';
import { sidebarMenu } from '../constants/sidebarMenu';
import { canAccessPage } from '../utils/permissions';
import Loader3D from './ui/Loader3D';
import ErrorBoundary from './common/ErrorBoundary';
import { palette as p, hero, glass, headingFont } from '../styles/tokens';

const drawerWidth = 272;
const gutter = 12;

const getInitials = (user) => {
  if (!user) return 'GS';
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'GS';
};

const findCurrentPage = (pathname) => {
  for (const section of sidebarMenu) {
    const item = section.items.find((i) => i.path === pathname);
    if (item) return { section: section.section, title: item.title };
  }
  return { section: 'GreenSteel', title: '' };
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  // Set by RoleRoute when someone opens a page their role can't use
  const deniedPage = location.state?.denied;
  const [dismissedKey, setDismissedKey] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => { setMobileOpen(false); }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    setProfileAnchor(null);
    logout();
    navigate('/', { replace: true });
  };

  // Current page + section for the top-bar breadcrumb
  const current = findCurrentPage(location.pathname);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const renderDrawer = (idPrefix) => (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      ...glass, borderRadius: { xs: 0, sm: '24px' },
      outline: `1px solid ${p.border}`, outlineOffset: -1,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 24px 48px -24px rgba(6,78,59,0.25)',
    }}>
      <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.22), transparent 70%)', top: -110, right: -90, pointerEvents: 'none' }} />

      {/* Brand */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2, display: 'flex', alignItems: 'center', gap: 1.25, position: 'relative' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: headingFont, fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.1, color: p.text, letterSpacing: '-0.03em' }}>
            GreenSteel
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: p.textSecondary, letterSpacing: '0.02em' }}>
            Environmental Monitoring
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mx: 2.5, mb: 2, height: '1px', background: `linear-gradient(90deg, transparent, ${p.border}, transparent)` }} />

      {/* Navigation */}
      <List component="nav" aria-label="Primary navigation" sx={{ px: 1.5, py: 0, flex: 1, overflowY: 'auto', position: 'relative' }}>
        {sidebarMenu.map((section) => {
          const items = section.items.filter((item) => canAccessPage(user, item.path));
          if (items.length === 0) return null;
          return (
            <Box key={section.section} sx={{ mb: 1.25 }}>
              <Typography sx={{ px: 1.5, mb: 0.5, color: '#64748B', fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {section.section}
              </Typography>
              {items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={active}
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      minHeight: 38, mb: 0.25, px: 1.25, borderRadius: '12px', position: 'relative',
                      color: active ? '#FFFFFF' : p.text,
                      transition: 'transform 180ms ease, color 180ms ease, background-color 180ms ease',
                      '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'transparent' },
                      '&:hover:not(.Mui-selected)': { bgcolor: 'rgba(4,120,87,0.07)', transform: 'translateX(3px)' },
                      '& .MuiListItemIcon-root': { minWidth: 38, color: 'inherit' },
                      '& .MuiListItemText-primary': { color: 'inherit' },
                    }}
                  >
                    {active && (
                      <Box
                        component={motion.div}
                        layoutId={`${idPrefix}-nav-pill`}
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                        sx={{
                          position: 'absolute', inset: 0, borderRadius: '12px', zIndex: 0,
                          background: `linear-gradient(180deg, #059669 0%, ${p.primary} 60%, ${p.primaryDark} 100%)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 0 ${p.primaryDeep}, 0 10px 20px -8px rgba(6,78,59,0.55)`,
                        }}
                      />
                    )}
                    <ListItemIcon sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{
                        width: 28, height: 28, borderRadius: '8px', display: 'grid', placeItems: 'center',
                        bgcolor: active ? 'rgba(255,255,255,0.16)' : 'rgba(4,120,87,0.08)',
                        color: active ? '#FFFFFF' : p.primary,
                        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                        '& svg': { fontSize: 17 },
                      }}>
                        <Icon />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ position: 'relative', zIndex: 1 }}
                      slotProps={{ primary: { fontSize: '0.875rem', fontWeight: active ? 700 : 550 } }}
                    />
                    {active && <Box sx={{ position: 'relative', zIndex: 1, width: 6, height: 6, borderRadius: '50%', bgcolor: p.mint, boxShadow: `0 0 10px ${p.mint}` }} />}
                  </ListItemButton>
                );
              })}
            </Box>
          );
        })}
      </List>

      {/* User card */}
      <Box sx={{ p: 1.5, position: 'relative' }}>
        <Box sx={{
          p: 1.5, borderRadius: '16px',
          background: hero.gradient(160),
          color: '#FFFFFF', position: 'relative', overflow: 'hidden',
          boxShadow: '0 16px 30px -14px rgba(6,78,59,0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
        }}>
          <Box sx={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.28), transparent 70%)', right: -40, top: -50 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, position: 'relative' }}>
            <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 700, color: p.night, background: `linear-gradient(135deg, ${p.mint}, ${p.sage})`, boxShadow: '0 4px 10px -2px rgba(52,211,153,0.5)' }}>
              {getInitials(user)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>
              <Typography noWrap sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
                {user?.role?.replaceAll('_', ' ') || 'Role'}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton
                onClick={handleLogout}
                aria-label="Sign out"
                sx={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)',
                  '&:hover': { bgcolor: 'rgba(220,38,38,0.85)', borderColor: 'transparent' },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <div className="gs-grid-bg" aria-hidden />

      {/* Floating glass top bar */}
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },
        bgcolor: 'transparent', color: p.text, boxShadow: 'none', backgroundImage: 'none',
        pt: { xs: 1, sm: `${gutter}px` }, px: { xs: 1, sm: `${gutter + 4}px` },
      }}>
        <Toolbar disableGutters sx={{
          minHeight: { xs: 56, sm: 60 }, px: { xs: 1, sm: 1.5 }, pl: { sm: 2.5 }, justifyContent: 'space-between',
          ...glass, borderRadius: '18px', outline: `1px solid ${p.border}`, outlineOffset: -1,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 32px -16px rgba(6,78,59,0.25)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { sm: 'none' }, color: p.text }} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: '0.8125rem', color: p.textSecondary, fontWeight: 500, display: { xs: 'none', md: 'block' } }}>
                {current.section}
              </Typography>
              {current.title && <ChevronRightIcon sx={{ fontSize: 16, color: '#94A3B8', display: { xs: 'none', md: 'block' } }} />}
              <Typography noWrap sx={{ fontFamily: headingFont, fontSize: '0.95rem', fontWeight: 800, color: p.text, letterSpacing: '-0.01em' }}>
                {current.title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, px: 1.5, height: 36, borderRadius: '10px',
              bgcolor: 'rgba(236,253,245,0.7)', border: `1px solid ${p.border}`,
            }}>
              <span className="gs-live-dot" />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: p.primary }}>Live</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: p.textSecondary }}>· {today}</Typography>
            </Box>
            <Tooltip title="View alerts">
              <IconButton component={Link} to="/alerts" aria-label="View alerts" sx={{
                width: 40, height: 40, borderRadius: '12px', color: p.text, bgcolor: '#FFFFFF',
                border: `1px solid ${p.border}`, boxShadow: '0 2px 0 rgba(15,23,42,0.04)',
                '&:hover': { bgcolor: p.primaryLight, transform: 'translateY(-2px)', boxShadow: '0 8px 16px -6px rgba(6,78,59,0.25)' },
              }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              aria-label="Open profile menu"
              sx={{ pl: 0.5, pr: 1, py: 0.5, borderRadius: '14px', border: '1px solid transparent', '&:hover': { bgcolor: '#FFFFFF', borderColor: p.border } }}
            >
              <Avatar sx={{
                width: 34, height: 34, fontSize: 13, fontWeight: 700, color: '#fff',
                background: `linear-gradient(145deg, #059669, ${p.primaryDark})`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 10px -3px rgba(6,78,59,0.5)`,
              }}>
                {getInitials(user)}
              </Avatar>
              <KeyboardArrowDownIcon sx={{ ml: 0.5, color: p.textSecondary }} fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { elevation: 0, sx: { mt: 1, minWidth: 220, p: 0.5 } } }}
            >
              <MenuItem disabled sx={{ opacity: '1 !important', color: p.text, py: 1.25, borderRadius: '10px', display: 'block' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: p.text }}>{user ? `${user.firstName} ${user.lastName}` : 'Profile'}</Typography>
                {user?.email && <Typography sx={{ fontSize: '0.75rem', color: p.textSecondary }}>{user.email}</Typography>}
              </MenuItem>
              <Box sx={{ height: '1px', bgcolor: p.border, my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: p.error, fontWeight: 600, py: 1.25, borderRadius: '10px', gap: 1, '&:hover': { bgcolor: '#FEF2F2' } }}>
                <LogoutIcon sx={{ fontSize: 18 }} /> Sign out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={Boolean(deniedPage) && dismissedKey !== location.key}
        autoHideDuration={5000}
        onClose={() => setDismissedKey(location.key)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setDismissedKey(location.key)} sx={{ fontWeight: 600 }}>
          Your role doesn't have access to {deniedPage}. You've been taken to the dashboard.
        </Alert>
      </Snackbar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'transparent', border: 'none' } }}
        >
          {renderDrawer('mobile')}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', bgcolor: 'transparent', p: `${gutter}px`, pr: 0 },
          }}
        >
          {renderDrawer('desktop')}
        </Drawer>
      </Box>

      {/* Content */}
      <Box component="main" sx={{
        flexGrow: 1,
        minWidth: 0,
        overflowX: 'hidden',
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        pt: { xs: '72px', sm: `${60 + gutter + 12}px` },
        display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 1,
      }}>
        <Box sx={{ flexGrow: 1, minWidth: 0, px: { xs: 2, sm: 3, lg: 4 }, pt: { xs: 2, sm: 2.5 }, pb: { xs: 3, sm: 4 }, width: '100%', maxWidth: 1600, mx: 'auto' }}>
          {/* Simple fade on route change. No exit animation: <Outlet/> already renders the
              NEW route, so animating the old wrapper out caused a double flash. */}
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              <ErrorBoundary resetKey={location.pathname}>
                <Suspense fallback={<Loader3D label="Loading..." minHeight="50vh" />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
