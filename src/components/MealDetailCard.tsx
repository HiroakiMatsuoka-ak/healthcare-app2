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
  Divider,
} from '@mui/material';
import {
  RestaurantMenu,
} from '@mui/icons-material';
import { MealRecord, FoodMenu } from '../services/apiService';

interface MealDetailCardProps {
  meals: MealRecord[];
  foodMenu: FoodMenu[];
}

const MealDetailCard: React.FC<MealDetailCardProps> = ({ meals, foodMenu }) => {
  // 食事タイプ別にグループ化
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.meal]) {
      acc[meal.meal] = [];
    }
    acc[meal.meal].push(meal);
    return acc;
  }, {} as Record<string, MealRecord[]>);

  // 食材IDから食材名を取得
  const getFoodName = (foodId: number) => {
    const food = foodMenu.find(f => f.id === foodId);
    return food?.name || '不明な食材';
  };

  // 食材IDから単位を取得
  const getFoodUnit = (foodId: number) => {
    const food = foodMenu.find(f => f.id === foodId);
    return food?.serving_unit || '';
  };

  // 食事タイプの順番
  const mealOrder = ['朝食', '昼食', '夕食', '間食'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <RestaurantMenu sx={{ mr: 1, verticalAlign: 'middle' }} />
          今日の食事詳細
        </Typography>
        
        {mealOrder.map((mealType) => {
          const mealList = groupedMeals[mealType] || [];
          if (mealList.length === 0) return null;

          const totalCalories = mealList.reduce((sum, meal) => sum + meal.calories, 0);

          return (
            <Box key={mealType} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {mealType}
                </Typography>
                <Chip 
                  label={`${totalCalories} kcal`} 
                  color="primary" 
                  size="small" 
                />
              </Box>

              <List dense>
                {mealList.map((meal, index) => (
                  <React.Fragment key={meal.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              {meal.time}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {meal.calories} kcal
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            {typeof meal.items === 'string' ? (
                              <Typography variant="body2">
                                {meal.items}
                              </Typography>
                            ) : (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {meal.items.map((item, itemIndex) => (
                                  <Chip
                                    key={itemIndex}
                                    label={`${getFoodName(item.food_id)} × ${item.servings}${getFoodUnit(item.food_id)}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < mealList.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          );
        })}

        {Object.keys(groupedMeals).length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            今日の食事記録はありません
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MealDetailCard;
