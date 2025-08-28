import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  DirectionsRun,
  Add,
  TodayOutlined,
  FitnessCenter,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useWorkouts } from '../hooks/useHealthData';
import { AddWorkoutDialog } from '../components/AddWorkoutDialog';
import { WorkoutRecordInput } from '../services/apiService';

const WorkoutPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState(false);
  
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { workouts, loading: workoutsLoading, error: workoutsError, addWorkout, refreshWorkouts } = useWorkouts(formattedDate);

  const handleAddWorkout = async (exercises: any[]) => {
    try {
      const workoutData: WorkoutRecordInput = {
        date: formattedDate,
        exercises: exercises
      };
      await addWorkout(workoutData);
      await refreshWorkouts();
    } catch (error) {
      console.error('運動の追加に失敗しました:', error);
    }
  };

  if (workoutsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          データの取得中にエラーが発生しました。バックエンドサーバーが起動しているか確認してください。
        </Alert>
      </Container>
    );
  }

  if (workoutsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + workout.total_calories_burned, 0);
  const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsRun />
          運動記録
        </Typography>
        <Typography variant="body1" color="text.secondary">
          日別の運動記録を確認・管理できます
        </Typography>
      </Box>

      {/* 日付選択 */}
      <Box sx={{ mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label="日付を選択"
            value={selectedDate}
            onChange={(newValue) => newValue && setSelectedDate(newValue)}
            slots={{
              textField: (params) => (
                <Card sx={{ p: 2, display: 'inline-block' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TodayOutlined color="primary" />
                    <Typography variant="h6">
                      {format(selectedDate, 'yyyy年MM月dd日', { locale: ja })}
                    </Typography>
                  </Box>
                </Card>
              ),
            }}
          />
        </LocalizationProvider>
      </Box>

      {/* カロリー消費合計 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {format(selectedDate, 'MM月dd日', { locale: ja })}の運動記録
              </Typography>
              <Typography variant="h4" color="primary">
                消費カロリー: {totalCaloriesBurned} kcal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                記録された運動: {totalExercises}種目
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddWorkoutDialogOpen(true)}
              size="large"
            >
              運動を追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 運動一覧 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {workouts.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  この日の運動記録はありません
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  「運動を追加」ボタンから記録を開始しましょう
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddWorkoutDialogOpen(true)}
                >
                  最初の運動を追加
                </Button>
              </CardContent>
            </Card>
          </Box>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsRun color="primary" />
                  ワークアウト #{workout.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {workout.date}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" color="primary">
                    {workout.total_calories_burned} kcal消費
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    種目数: {workout.exercises.length}種目
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    実施種目:
                  </Typography>
                  {workout.exercises.map((exercise, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • 運動ID {exercise.workout_id}: {exercise.duration_minutes}分
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* フローティングアクションボタン */}
      <Fab
        color="primary"
        aria-label="add workout"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddWorkoutDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* 運動追加ダイアログ */}
      <AddWorkoutDialog
        open={addWorkoutDialogOpen}
        onClose={() => setAddWorkoutDialogOpen(false)}
        onAdd={handleAddWorkout}
      />
    </Container>
  );
};

export default WorkoutPage;
