import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Remove,
  ExpandMore,
  Delete,
} from '@mui/icons-material';
import { useFoodMenu } from '../hooks/useHealthData';
import { FoodMenu, MealItem, MealRecordInput } from '../services/apiService';

interface AddMealDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (meal: MealRecordInput) => Promise<void>;
}

const AddMealDialog: React.FC<AddMealDialogProps> = ({ open, onClose, onSubmit }) => {
  const { foodMenu, loading } = useFoodMenu();
  const [mealType, setMealType] = useState<string>('朝食');
  const [mealTime, setMealTime] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<(MealItem & { name: string; calories: number; unit: string })[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 現在時刻を取得してデフォルトの時間を設定
  useEffect(() => {
    if (open) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setMealTime(`${hours}:${minutes}`);
    }
  }, [open]);

  // カテゴリ別にメニューをグループ化
  const groupedMenu = foodMenu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FoodMenu[]>);

  const categories = ['主食', '主菜', '副菜', '汁物', 'デザート'];

  // 食材を追加
  const addFoodItem = (food: FoodMenu) => {
    const existingItem = selectedItems.find(item => item.food_id === food.id);
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(item =>
          item.food_id === food.id
            ? { ...item, servings: item.servings + 0.5 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [
        ...prev,
        {
          food_id: food.id,
          servings: 1,
          name: food.name,
          calories: food.calories_per_serving,
          unit: food.serving_unit,
        }
      ]);
    }
  };

  // 食材の分量を変更
  const updateServings = (foodId: number, servings: number) => {
    if (servings <= 0) {
      removeItem(foodId);
      return;
    }
    setSelectedItems(prev =>
      prev.map(item =>
        item.food_id === foodId
          ? { ...item, servings }
          : item
      )
    );
  };

  // 食材を削除
  const removeItem = (foodId: number) => {
    setSelectedItems(prev => prev.filter(item => item.food_id !== foodId));
  };

  // 総カロリー計算
  const totalCalories = selectedItems.reduce((sum, item) => {
    return sum + (item.calories * item.servings);
  }, 0);

  // フォームリセット
  const resetForm = () => {
    setMealType('朝食');
    setMealTime('');
    setSelectedItems([]);
  };

  // 送信処理
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert('食材を選択してください');
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await onSubmit({
        time: mealTime,
        meal: mealType,
        items: selectedItems.map(item => ({
          food_id: item.food_id,
          servings: item.servings,
        })),
        date: today,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('食事の追加に失敗しました:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>食事を追加</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* 食事の基本情報 */}
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>食事タイプ</InputLabel>
                <Select
                  value={mealType}
                  label="食事タイプ"
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <MenuItem value="朝食">朝食</MenuItem>
                  <MenuItem value="昼食">昼食</MenuItem>
                  <MenuItem value="夕食">夕食</MenuItem>
                  <MenuItem value="間食">間食</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="時間"
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          {/* 選択済み食材リスト */}
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  選択済み食材 (合計: {Math.round(totalCalories)} kcal)
                </Typography>
                {selectedItems.length === 0 ? (
                  <Typography color="text.secondary">
                    食材を選択してください
                  </Typography>
                ) : (
                  <List dense>
                    {selectedItems.map((item) => (
                      <ListItem key={item.food_id}>
                        <ListItemText
                          primary={item.name}
                          secondary={`${item.servings} ${item.unit} - ${Math.round(item.calories * item.servings)} kcal`}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateServings(item.food_id, item.servings - 0.5)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                              {item.servings}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateServings(item.food_id, item.servings + 0.5)}
                            >
                              <Add />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => removeItem(item.food_id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* 食材選択 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              食材を選択
            </Typography>
            {loading ? (
              <Typography>読み込み中...</Typography>
            ) : (
              categories.map((category) => (
                groupedMenu[category] && (
                  <Accordion key={category}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">{category}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {groupedMenu[category].map((food) => (
                          <Chip
                            key={food.id}
                            label={`${food.name} (${food.calories_per_serving}kcal)`}
                            onClick={() => addFoodItem(food)}
                            color={selectedItems.some(item => item.food_id === food.id) ? 'primary' : 'default'}
                            variant={selectedItems.some(item => item.food_id === food.id) ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )
              ))
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedItems.length === 0 || submitting}
        >
          {submitting ? '追加中...' : '追加'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMealDialog;
