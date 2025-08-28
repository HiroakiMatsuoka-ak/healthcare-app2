import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { WorkoutRecord } from '../services/apiService';
import { useWorkoutMenu } from '../hooks/useHealthData';

interface WorkoutDetailCardProps {
  workouts: WorkoutRecord[];
}

export const WorkoutDetailCard: React.FC<WorkoutDetailCardProps> = ({ workouts }) => {
  const { workoutMenu } = useWorkoutMenu();

  const getWorkoutName = (workoutId: number): string => {
    const workout = workoutMenu.find(w => w.id === workoutId);
    return workout ? workout.name : `運動ID: ${workoutId}`;
  };

  const getWorkoutCategory = (workoutId: number): string => {
    const workout = workoutMenu.find(w => w.id === workoutId);
    return workout ? workout.category : '不明';
  };

  const getWorkoutIntensity = (workoutId: number): string => {
    const workout = workoutMenu.find(w => w.id === workoutId);
    return workout ? workout.intensity : '不明';
  };

  const getTotalDuration = (): number => {
    return workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((sum, exercise) => sum + exercise.duration_minutes, 0);
    }, 0);
  };

  const getTotalCaloriesBurned = (): number => {
    return workouts.reduce((total, workout) => total + workout.total_calories_burned, 0);
  };

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">今日の運動記録</Typography>
          </Box>
          <Typography color="text.secondary">
            今日はまだ運動記録がありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">今日の運動記録</Typography>
        </Box>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="h6" color="success.contrastText">
            総消費カロリー: {getTotalCaloriesBurned()} kcal
          </Typography>
          <Typography variant="body2" color="success.contrastText">
            総運動時間: {getTotalDuration()}分
          </Typography>
        </Box>

        <List>
          {workouts.map((workout, workoutIndex) => (
            <React.Fragment key={workout.id}>
              {workoutIndex > 0 && <Divider />}
              <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    運動セッション {workoutIndex + 1} - {workout.total_calories_burned} kcal消費
                  </Typography>
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <Box 
                      key={exerciseIndex}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        bgcolor: 'grey.50',
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {getWorkoutName(exercise.workout_id)}
                        </Typography>
                        <Chip 
                          label={getWorkoutCategory(exercise.workout_id)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={getWorkoutIntensity(exercise.workout_id)}
                          size="small"
                          color={
                            getWorkoutIntensity(exercise.workout_id) === '軽度' ? 'success' : 
                            getWorkoutIntensity(exercise.workout_id) === '中度' ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {exercise.duration_minutes}分
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
