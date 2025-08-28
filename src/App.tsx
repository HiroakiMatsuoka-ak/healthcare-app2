import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
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
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useUser, useWeightData, useCalorieData, useMeals, useActivity, useTodayCalories, useFoodMenu, useWorkouts, useTodayWorkouts } from './hooks/useHealthData';
import AddMealDialog from './components/AddMealDialog';
import MealDetailCard from './components/MealDetailCard';
import { AddWorkoutDialog } from './components/AddWorkoutDialog';
import { WorkoutDetailCard } from './components/WorkoutDetailCard';
import { WorkoutRecordInput } from './services/apiService';

const App: React.FC = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { weightData, loading: weightLoading, error: weightError } = useWeightData();
  const { calorieData, loading: calorieLoading, error: calorieError } = useCalorieData();
  
  const today = new Date().toISOString().split('T')[0];
  const { meals: todayMeals, loading: mealsLoading, error: mealsError, addMeal, refreshMeals } = useMeals(today);
  const { workouts: todayWorkouts, loading: workoutsLoading, error: workoutsError, addWorkout, refreshWorkouts } = useWorkouts(today);
  const { activity, loading: activityLoading, error: activityError } = useActivity();
  const { todayCalories, loading: caloriesLoading, error: caloriesError } = useTodayCalories();
  const { todayWorkouts: workoutCalories, loading: workoutCaloriesLoading, error: workoutCaloriesError } = useTodayWorkouts();
  const { foodMenu } = useFoodMenu();
  
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false);
  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState(false);

  const handleAddMeal = async (mealData: any) => {
    try {
      await addMeal(mealData);
      // 食事追加後にカロリーデータも更新
      await refreshMeals();
    } catch (error) {
      console.error('食事の追加に失敗しました:', error);
    }
  };

  const handleAddWorkout = async (exercises: any[]) => {
    try {
      const workoutData: WorkoutRecordInput = {
        date: today,
        exercises: exercises
      };
      await addWorkout(workoutData);
      // 運動追加後にデータを更新
      await refreshWorkouts();
    } catch (error) {
      console.error('運動の追加に失敗しました:', error);
    }
  };

  // エラーハンドリング
  if (userError || weightError || calorieError || mealsError || workoutsError || activityError || caloriesError || workoutCaloriesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          データの取得中にエラーが発生しました。バックエンドサーバーが起動しているか確認してください。
        </Alert>
      </Container>
    );
  }

  // ローディング状態
  if (userLoading || weightLoading || calorieLoading || mealsLoading || workoutsLoading || activityLoading || caloriesLoading || workoutCaloriesLoading) {
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
              今日もフィットネス管理を頑張りましょう
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
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
        <Box sx={{ position: 'relative' }}>
          <MealDetailCard meals={todayMeals} foodMenu={foodMenu} />
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Button variant="outlined" startIcon={<Add />} size="small" onClick={() => setAddMealDialogOpen(true)}>
              食事を追加
            </Button>
          </Box>
        </Box>

        {/* 今日の運動記録 */}
        <Box sx={{ position: 'relative' }}>
          <WorkoutDetailCard workouts={todayWorkouts} />
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Button variant="outlined" startIcon={<Add />} size="small" onClick={() => setAddWorkoutDialogOpen(true)}>
              運動を追加
            </Button>
          </Box>
        </Box>
      </Box>

      {/* クイックアクション */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          クイックアクション
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddMealDialogOpen(true)}>
            食事を記録
          </Button>
          <Button variant="contained" startIcon={<DirectionsRun />} onClick={() => setAddWorkoutDialogOpen(true)}>
            運動を記録
          </Button>
          <Button variant="outlined" startIcon={<MonitorWeight />}>
            体重を記録
          </Button>
          <Button variant="outlined" startIcon={<TrendingUp />}>
            レポートを見る
          </Button>
        </Box>
      </Box>

      {/* 食事追加ダイアログ */}
      <AddMealDialog
        open={addMealDialogOpen}
        onClose={() => setAddMealDialogOpen(false)}
        onSubmit={handleAddMeal}
      />

      {/* 運動記録ダイアログ */}
      <AddWorkoutDialog
        open={addWorkoutDialogOpen}
        onClose={() => setAddWorkoutDialogOpen(false)}
        onAdd={handleAddWorkout}
      />
    </Container>
  );
};

export default App;
