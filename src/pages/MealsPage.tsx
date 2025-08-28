import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  RestaurantMenu,
  Add,
  ArrowBack,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMeals } from '../hooks/useHealthData';
import { MealRecord } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const MealsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newMeal, setNewMeal] = useState({
    meal: '',
    time: '',
    calories: '',
    items: '',
  });

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { meals, loading, error, addMeal } = useMeals(formattedDate);

  const handleAddMeal = async () => {
    try {
      const mealData: Omit<MealRecord, 'id'> = {
        meal: newMeal.meal,
        time: newMeal.time,
        calories: parseInt(newMeal.calories),
        items: newMeal.items,
        date: formattedDate,
      };
      
      await addMeal(mealData);
      setOpenAddDialog(false);
      setNewMeal({ meal: '', time: '', calories: '', items: '' });
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  const mealTypes = [
    { value: '朝食', label: '朝食' },
    { value: '昼食', label: '昼食' },
    { value: '夕食', label: '夕食' },
    { value: '間食', label: '間食' },
  ];

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* ヘッダー */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => navigate('/')} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1">
              食事記録
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <DatePicker
              label="日付を選択"
              value={selectedDate}
              onChange={(newValue) => newValue && setSelectedDate(newValue)}
              format="yyyy/MM/dd"
              slotProps={{ textField: { size: 'small' } }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
            >
              食事を追加
            </Button>
            <Chip 
              label={`合計: ${totalCalories} kcal`} 
              color="primary" 
              size="medium"
            />
          </Box>
        </Box>

        {/* 食事一覧 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {format(selectedDate, 'yyyy年MM月dd日', { locale: ja })} の食事記録
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : meals.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  この日の食事記録はありません
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setOpenAddDialog(true)}
                  sx={{ mt: 2 }}
                >
                  最初の食事を追加
                </Button>
              </Box>
            ) : (
              <List>
                {meals.map((meal, index) => (
                  <React.Fragment key={meal.id}>
                    <ListItem>
                      <ListItemIcon>
                        <RestaurantMenu color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="h6" component="span">
                                {meal.meal}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                {meal.time}
                              </Typography>
                            </Box>
                            <Chip 
                              label={`${meal.calories} kcal`} 
                              color="secondary" 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {meal.items}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < meals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* 食事追加ダイアログ */}
        <Dialog 
          open={openAddDialog} 
          onClose={() => setOpenAddDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>食事を追加</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                select
                label="食事の種類"
                value={newMeal.meal}
                onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
                fullWidth
                required
              >
                {mealTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                label="時間"
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="カロリー"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                fullWidth
                required
                InputProps={{ endAdornment: 'kcal' }}
              />
              
              <TextField
                label="食べ物"
                value={newMeal.items}
                onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="例: ご飯、味噌汁、卵焼き"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={handleAddMeal}
              variant="contained"
              disabled={!newMeal.meal || !newMeal.time || !newMeal.calories || !newMeal.items}
            >
              追加
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default MealsPage;