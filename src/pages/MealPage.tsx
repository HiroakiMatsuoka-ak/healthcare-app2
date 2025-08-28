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
  RestaurantMenu,
  Add,
  TodayOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMeals, useFoodMenu } from '../hooks/useHealthData';
import AddMealDialog from '../components/AddMealDialog';

const MealPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false);
  
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { meals, loading: mealsLoading, error: mealsError, addMeal, refreshMeals } = useMeals(formattedDate);
  const { foodMenu } = useFoodMenu();

  const handleAddMeal = async (mealData: any) => {
    try {
      await addMeal(mealData);
      await refreshMeals();
    } catch (error) {
      console.error('食事の追加に失敗しました:', error);
    }
  };

  if (mealsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          データの取得中にエラーが発生しました。バックエンドサーバーが起動しているか確認してください。
        </Alert>
      </Container>
    );
  }

  if (mealsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestaurantMenu />
          食事記録
        </Typography>
        <Typography variant="body1" color="text.secondary">
          日別の食事記録を確認・管理できます
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

      {/* カロリー合計 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {format(selectedDate, 'MM月dd日', { locale: ja })}の食事記録
              </Typography>
              <Typography variant="h4" color="primary">
                合計カロリー: {totalCalories} kcal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                記録された食事: {meals.length}件
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddMealDialogOpen(true)}
              size="large"
            >
              食事を追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 食事一覧 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {meals.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <RestaurantMenu sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  この日の食事記録はありません
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  「食事を追加」ボタンから記録を開始しましょう
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddMealDialogOpen(true)}
                >
                  最初の食事を追加
                </Button>
              </CardContent>
            </Card>
          </Box>
        ) : (
          meals.map((meal) => (
            <Card key={meal.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {meal.meal}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {meal.time}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" color="primary">
                    {meal.calories} kcal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    食品数: {meal.items.length}品目
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* フローティングアクションボタン */}
      <Fab
        color="primary"
        aria-label="add meal"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddMealDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* 食事追加ダイアログ */}
      <AddMealDialog
        open={addMealDialogOpen}
        onClose={() => setAddMealDialogOpen(false)}
        onSubmit={handleAddMeal}
      />
    </Container>
  );
};

export default MealPage;
