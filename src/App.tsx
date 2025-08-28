import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  RestaurantMenu,
  DirectionsRun,
  MonitorWeight,
  LocalDrink,
  Add,
  TrendingUp,
  Favorite,
  Schedule,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useUser, useWeightData, useCalorieData, useMeals, useActivity, useTodayCalories } from './hooks/useHealthData';

const App: React.FC = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { weightData, loading: weightLoading, error: weightError } = useWeightData();
  const { calorieData, loading: calorieLoading, error: calorieError } = useCalorieData();
  const { meals: todayMeals, loading: mealsLoading, error: mealsError } = useMeals('2025-08-27');
  const { activity, loading: activityLoading, error: activityError } = useActivity();
  const { todayCalories, loading: caloriesLoading, error: caloriesError } = useTodayCalories();

  // エラーハンドリング
  if (userError || weightError || calorieError || mealsError || activityError || caloriesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          データの取得中にエラーが発生しました。バックエンドサーバーが起動しているか確認してください。
        </Alert>
      </Container>
    );
  }

  // ローディング状態
  if (userLoading || weightLoading || calorieLoading || mealsLoading || activityLoading || caloriesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user || !activity || !todayCalories) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">データが見つかりません。</Alert>
      </Container>
    );
  }

  const calorieProgress = (todayCalories.total_calories / user.daily_calorie_goal) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 64, height: 64 }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              こんにちは、{user.name}さん！
            </Typography>
            <Typography variant="body1" color="text.secondary">
              今日も健康管理を頑張りましょう
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* メインコンテンツ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* カロリー摂取状況 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <RestaurantMenu sx={{ mr: 1, verticalAlign: 'middle' }} />
              今日のカロリー摂取
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary">
                {todayCalories.total_calories} / {user.daily_calorie_goal} kcal
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(calorieProgress, 100)}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                color={calorieProgress > 100 ? 'error' : 'primary'}
              />
              <Typography variant="caption" color="text.secondary">
                残り {Math.max(0, user.daily_calorie_goal - todayCalories.total_calories)} kcal
              </Typography>
            </Box>
            
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calorieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {calorieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* 体重推移 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MonitorWeight sx={{ mr: 1, verticalAlign: 'middle' }} />
              体重推移
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary">
                {user.current_weight} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                目標: {user.target_weight} kg (残り {user.current_weight - user.target_weight} kg)
              </Typography>
            </Box>
            
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 下段のコンテンツ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3, mb: 3 }}>
        {/* 今日のアクティビティ */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              今日のアクティビティ
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DirectionsRun color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">歩数</Typography>
              </Box>
              <Typography variant="h5">{activity.steps.toLocaleString()} 歩</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activity.steps / 10000) * 100}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                目標: 10,000歩
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalDrink color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">水分摂取</Typography>
              </Box>
              <Typography variant="h5">{activity.water_glasses} / 8 杯</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activity.water_glasses / 8) * 100}
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Favorite color="error" sx={{ mr: 1 }} />
                <Typography variant="body1">健康スコア</Typography>
              </Box>
              <Typography variant="h5" color="success.main">{activity.health_score}点</Typography>
              <Chip label="良好" color="success" size="small" />
            </Box>
          </CardContent>
        </Card>

        {/* 今日の食事記録 */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                今日の食事記録
              </Typography>
              <Button variant="outlined" startIcon={<Add />} size="small">
                食事を追加
              </Button>
            </Box>
            
            <List>
              {todayMeals.map((meal, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <RestaurantMenu />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{meal.meal}</Typography>
                          <Chip label={`${meal.calories} kcal`} size="small" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {meal.time} - {meal.items}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < todayMeals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* クイックアクション */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          クイックアクション
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<Add />}>
            食事を記録
          </Button>
          <Button variant="outlined" startIcon={<MonitorWeight />}>
            体重を記録
          </Button>
          <Button variant="outlined" startIcon={<DirectionsRun />}>
            運動を記録
          </Button>
          <Button variant="outlined" startIcon={<TrendingUp />}>
            レポートを見る
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
