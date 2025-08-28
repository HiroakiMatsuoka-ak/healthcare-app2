import { useState, useEffect } from 'react';
import { 
  apiService, 
  User, 
  WeightRecord, 
  CalorieData, 
  MealRecord, 
  ActivityData, 
  TodayCalories, 
  FoodMenu, 
  MealRecordInput,
  WorkoutMenu,
  WorkoutRecord,
  WorkoutRecordInput,
  TodayWorkouts
} from '../services/apiService';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiService.getUser();
        setUser(userData);
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export const useWeightData = () => {
  const [weightData, setWeightData] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWeightData();
        setWeightData(data);
      } catch (err) {
        setError('体重データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeightData();
  }, []);

  return { weightData, loading, error };
};

export const useCalorieData = () => {
  const [calorieData, setCalorieData] = useState<CalorieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalorieData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCalorieData();
        setCalorieData(data);
      } catch (err) {
        setError('カロリーデータの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalorieData();
  }, []);

  return { calorieData, loading, error };
};

export const useMeals = (date?: string) => {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMeals(date);
        setMeals(data);
      } catch (err) {
        setError('食事データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [date]);

  const addMeal = async (meal: MealRecordInput) => {
    try {
      const newMeal = await apiService.addMeal(meal);
      setMeals(prev => [...prev, newMeal]);
      return newMeal;
    } catch (err) {
      setError('食事の追加に失敗しました');
      console.error(err);
      throw err;
    }
  };

  const refreshMeals = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMeals(date);
      setMeals(data);
    } catch (err) {
      setError('食事データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { meals, loading, error, addMeal, refreshMeals };
};

export const useActivity = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await apiService.getActivity();
        setActivity(data);
      } catch (err) {
        setError('アクティビティデータの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading, error };
};

export const useFoodMenu = () => {
  const [foodMenu, setFoodMenu] = useState<FoodMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFoodMenu();
        setFoodMenu(data);
      } catch (err) {
        setError('食事メニューの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodMenu();
  }, []);

  return { foodMenu, loading, error };
};

export const useTodayCalories = () => {
  const [todayCalories, setTodayCalories] = useState<TodayCalories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayCalories = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTodayCalories();
        setTodayCalories(data);
      } catch (err) {
        setError('今日のカロリーデータの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCalories();
  }, []);

  return { todayCalories, loading, error };
};

export const useWorkoutMenu = () => {
  const [workoutMenu, setWorkoutMenu] = useState<WorkoutMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutMenu = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWorkoutMenu();
        setWorkoutMenu(data);
      } catch (err) {
        setError('運動メニューの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutMenu();
  }, []);

  return { workoutMenu, loading, error };
};

export const useWorkouts = (date?: string) => {
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWorkouts(date);
        setWorkouts(data);
      } catch (err) {
        setError('運動データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [date]);

  const addWorkout = async (workout: WorkoutRecordInput) => {
    try {
      const newWorkout = await apiService.addWorkout(workout);
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (err) {
      setError('運動の追加に失敗しました');
      console.error(err);
      throw err;
    }
  };

  const refreshWorkouts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWorkouts(date);
      setWorkouts(data);
    } catch (err) {
      setError('運動データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { workouts, loading, error, addWorkout, refreshWorkouts };
};

export const useTodayWorkouts = () => {
  const [todayWorkouts, setTodayWorkouts] = useState<TodayWorkouts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayWorkouts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTodayWorkouts();
        setTodayWorkouts(data);
      } catch (err) {
        setError('今日の運動データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWorkouts();
  }, []);

  return { todayWorkouts, loading, error };
};
