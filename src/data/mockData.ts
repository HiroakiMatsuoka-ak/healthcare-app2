export const mockHealthData = {
  user: {
    id: 1,
    name: '田中 太郎',
    age: 28,
    height: 170,
    current_weight: 68.5,
    target_weight: 65,
    daily_calorie_goal: 2000,
    avatar: '/api/placeholder/64/64'
  },

  weightData: [
    { date: '1/1', weight: 70.2 },
    { date: '1/8', weight: 69.8 },
    { date: '1/15', weight: 69.3 },
    { date: '1/22', weight: 68.9 },
    { date: '1/29', weight: 68.5 },
  ],

  calorieData: [
    { name: '朝食', value: 350, color: '#FF8042' },
    { name: '昼食', value: 650, color: '#00C49F' },
    { name: '夕食', value: 580, color: '#FFBB28' },
    { name: '間食', value: 120, color: '#FF6B9D' },
  ],

  todayMeals: [
    { id: 1, time: '07:30', meal: '朝食', calories: 350, items: 'ご飯、味噌汁、卵焼き', date: '2025-08-27' },
    { id: 2, time: '12:30', meal: '昼食', calories: 650, items: '親子丼、サラダ', date: '2025-08-27' },
    { id: 3, time: '19:00', meal: '夕食', calories: 580, items: '焼き魚、野菜炒め、ご飯', date: '2025-08-27' },
  ],

  activity: {
    steps: 8234,
    water_glasses: 6,
    health_score: 85
  }
};
