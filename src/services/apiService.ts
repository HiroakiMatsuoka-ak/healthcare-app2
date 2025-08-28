const API_BASE_URL = 'http://localhost:8000/api';

// 型定義
export interface User {
  id: number;
  name: string;
  age: number;
  height: number;
  current_weight: number;
  target_weight: number;
  daily_calorie_goal: number;
  avatar?: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface CalorieData {
  name: string;
  value: number;
  color: string;
}

export interface FoodMenu {
  id: number;
  name: string;
  calories_per_serving: number;
  category: string;
  serving_unit: string;
}

export interface MealItem {
  food_id: number;
  servings: number;
}

export interface MealRecord {
  id: number;
  time: string;
  meal: string;
  calories: number;
  items: MealItem[];
  date: string;
}

export interface MealRecordInput {
  time: string;
  meal: string;
  items: MealItem[];
  date: string;
}

export interface WorkoutMenu {
  id: number;
  name: string;
  calories_per_minute: number;
  category: string;
  intensity: string;
}

export interface WorkoutItem {
  workout_id: number;
  duration_minutes: number;
}

export interface WorkoutRecord {
  id: number;
  date: string;
  total_calories_burned: number;
  exercises: WorkoutItem[];
}

export interface WorkoutRecordInput {
  date: string;
  exercises: WorkoutItem[];
}

export interface ActivityData {
  steps: number;
  water_glasses: number;
  health_score: number;
}

export interface TodayCalories {
  total_calories: number;
}

export interface TodayWorkouts {
  total_calories_burned: number;
}

class ApiService {
  private async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async postData<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ユーザー情報を取得
  async getUser(): Promise<User> {
    return this.fetchData<User>('/user');
  }

  // 体重推移データを取得
  async getWeightData(): Promise<WeightRecord[]> {
    return this.fetchData<WeightRecord[]>('/weight-data');
  }

  // カロリー摂取データを取得
  async getCalorieData(): Promise<CalorieData[]> {
    return this.fetchData<CalorieData[]>('/calorie-data');
  }

  // 食事メニューを取得
  async getFoodMenu(): Promise<FoodMenu[]> {
    return this.fetchData<FoodMenu[]>('/food-menu');
  }

  // カテゴリ別食事メニューを取得
  async getFoodMenuByCategory(category: string): Promise<FoodMenu[]> {
    return this.fetchData<FoodMenu[]>(`/food-menu/category/${category}`);
  }

  // 食事記録を取得
  async getMeals(date?: string): Promise<MealRecord[]> {
    const url = date ? `/meals?date=${date}` : '/meals';
    return this.fetchData<MealRecord[]>(url);
  }

  // 食事記録を追加
  async addMeal(meal: MealRecordInput): Promise<MealRecord> {
    return this.postData<MealRecord>('/meals', meal);
  }

  // アクティビティデータを取得
  async getActivity(): Promise<ActivityData> {
    return this.fetchData<ActivityData>('/activity');
  }

  // 今日の総摂取カロリーを取得
  async getTodayCalories(): Promise<TodayCalories> {
    return this.fetchData<TodayCalories>('/today-calories');
  }

  // 運動メニューを取得
  async getWorkoutMenu(): Promise<WorkoutMenu[]> {
    return this.fetchData<WorkoutMenu[]>('/workout-menu');
  }

  // カテゴリ別運動メニューを取得
  async getWorkoutMenuByCategory(category: string): Promise<WorkoutMenu[]> {
    return this.fetchData<WorkoutMenu[]>(`/workout-menu/category/${category}`);
  }

  // 運動記録を取得
  async getWorkouts(date?: string): Promise<WorkoutRecord[]> {
    const url = date ? `/workouts?date=${date}` : '/workouts';
    return this.fetchData<WorkoutRecord[]>(url);
  }

  // 運動記録を追加
  async addWorkout(workout: WorkoutRecordInput): Promise<WorkoutRecord> {
    return this.postData<WorkoutRecord>('/workouts', workout);
  }

  // 今日の総消費カロリーを取得
  async getTodayWorkouts(): Promise<TodayWorkouts> {
    return this.fetchData<TodayWorkouts>('/today-workouts');
  }
}

export const apiService = new ApiService();
