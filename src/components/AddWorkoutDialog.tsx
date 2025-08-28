import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useWorkoutMenu } from '../hooks/useHealthData';
import { WorkoutMenu, WorkoutItem } from '../services/apiService';

interface AddWorkoutDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (exercises: WorkoutItem[]) => Promise<void>;
}

const WORKOUT_CATEGORIES = ['有酸素運動', '筋力トレーニング', 'ストレッチ', '球技', 'その他'];

export const AddWorkoutDialog: React.FC<AddWorkoutDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const { workoutMenu, loading, error } = useWorkoutMenu();
  const [selectedExercises, setSelectedExercises] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedExercises(new Map());
    }
  }, [open]);

  const getWorkoutsByCategory = (category: string): WorkoutMenu[] => {
    return workoutMenu.filter(workout => workout.category === category);
  };

  const updateExerciseDuration = (workoutId: number, duration: number) => {
    const newSelectedExercises = new Map(selectedExercises);
    if (duration <= 0) {
      newSelectedExercises.delete(workoutId);
    } else {
      newSelectedExercises.set(workoutId, duration);
    }
    setSelectedExercises(newSelectedExercises);
  };

  const getTotalCaloriesBurned = (): number => {
    let total = 0;
    selectedExercises.forEach((duration, workoutId) => {
      const workout = workoutMenu.find(w => w.id === workoutId);
      if (workout) {
        total += workout.calories_per_minute * duration;
      }
    });
    return Math.round(total);
  };

  const handleSubmit = async () => {
    if (selectedExercises.size === 0) return;

    setIsSubmitting(true);
    try {
      const exercises: WorkoutItem[] = Array.from(selectedExercises.entries()).map(([workoutId, duration]) => ({
        workout_id: workoutId,
        duration_minutes: duration
      }));

      await onAdd(exercises);
      onClose();
    } catch (error) {
      console.error('運動の追加に失敗しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWorkoutItem = (workout: WorkoutMenu) => {
    const currentDuration = selectedExercises.get(workout.id) || 0;
    const caloriesBurned = Math.round(workout.calories_per_minute * currentDuration);

    return (
      <Box key={workout.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {workout.name}
          </Typography>
          <Chip 
            label={workout.intensity} 
            size="small" 
            color={
              workout.intensity === '軽度' ? 'success' : 
              workout.intensity === '中度' ? 'warning' : 'error'
            }
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {workout.calories_per_minute.toFixed(1)} kcal/分
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => updateExerciseDuration(workout.id, Math.max(0, currentDuration - 5))}
              disabled={currentDuration <= 0}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
              {currentDuration}分
            </Typography>
            
            <Button
              size="small"
              variant="outlined"
              onClick={() => updateExerciseDuration(workout.id, currentDuration + 5)}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>

          {currentDuration > 0 && (
            <Typography variant="body2" color="primary">
              {caloriesBurned} kcal
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography>運動メニューを読み込み中...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>閉じる</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">運動記録を追加</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            運動を選択して時間を設定してください
          </Typography>
        </Box>

        {WORKOUT_CATEGORIES.map((category) => {
          const categoryWorkouts = getWorkoutsByCategory(category);
          if (categoryWorkouts.length === 0) return null;

          return (
            <Accordion key={category} defaultExpanded={category === '有酸素運動'}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {category} ({categoryWorkouts.length}種類)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {categoryWorkouts.map(renderWorkoutItem)}
              </AccordionDetails>
            </Accordion>
          );
        })}

        {selectedExercises.size > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" color="primary.contrastText">
              合計消費カロリー: {getTotalCaloriesBurned()} kcal
            </Typography>
            <Typography variant="body2" color="primary.contrastText">
              選択した運動: {selectedExercises.size}種類
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={selectedExercises.size === 0 || isSubmitting}
        >
          {isSubmitting ? '追加中...' : '運動を追加'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
