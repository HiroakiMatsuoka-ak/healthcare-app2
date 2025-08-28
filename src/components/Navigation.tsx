import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RestaurantMenu,
  DirectionsRun,
  Home,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      label: 'ダッシュボード',
      icon: <DashboardIcon />,
    },
    {
      path: '/meals',
      label: '食事記録',
      icon: <RestaurantMenu />,
    },
    {
      path: '/workouts',
      label: '運動記録',
      icon: <DirectionsRun />,
    },
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* ロゴ・タイトル */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <Home />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            ヘルスケアアプリ
          </Typography>
        </Box>

        {/* ナビゲーションメニュー */}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: 1,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
