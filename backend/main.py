from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
import json
from database import db

app = FastAPI(title="ぶいざっぷ API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React開発サーバー
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データモデル
class User(BaseModel):
    id: int
    name: str
    age: int
    height: float
    current_weight: float
    target_weight: float
    daily_calorie_goal: int
    avatar: Optional[str] = None

class WeightRecord(BaseModel):
    date: str
    weight: float

class CalorieData(BaseModel):
    name: str
    value: int
    color: str

class FoodMenu(BaseModel):
    id: int
    name: str
    calories_per_serving: int
    category: str  # "主食", "主菜", "副菜", "汁物", "デザート"
    serving_unit: str  # "1杯", "1切れ", "1個"など

class MealItem(BaseModel):
    food_id: int
    servings: float

class MealRecord(BaseModel):
    id: int
    time: str
    meal: str  # "朝食", "昼食", "夕食"
    calories: int
    items: List[MealItem]
    date: str

class MealRecordInput(BaseModel):
    time: str
    meal: str
    items: List[MealItem]
    date: str

class WorkoutMenu(BaseModel):
    id: int
    name: str
    calories_per_minute: float
    category: str  # "有酸素運動", "筋力トレーニング", "ストレッチ", "球体", "その他"
    intensity: str  # "軽度", "中程度", "高強度"

class WorkoutItem(BaseModel):
    workout_id: int
    duration_minutes: int

class WorkoutRecord(BaseModel):
    id: int
    date: str
    total_calories_burned: int
    exercises: List[WorkoutItem]

class WorkoutRecordInput(BaseModel):
    date: str
    exercises: List[WorkoutItem]

class ActivityData(BaseModel):
    steps: int
    water_glasses: int
    health_score: int

# テストデータ
mock_user = User(
    id=1,
    name="田中 太郎",
    age=28,
    height=170.0,
    current_weight=68.5,
    target_weight=65.0,
    daily_calorie_goal=2000,
    avatar="/api/placeholder/64/64"
)

weight_data = [
    WeightRecord(date="1/1", weight=70.2),
    WeightRecord(date="1/8", weight=69.8),
    WeightRecord(date="1/15", weight=69.3),
    WeightRecord(date="1/22", weight=68.9),
    WeightRecord(date="1/29", weight=68.5),
]

calorie_data = [
    CalorieData(name="朝食", value=350, color="#FF8042"),
    CalorieData(name="昼食", value=650, color="#00C49F"),
    CalorieData(name="夕食", value=580, color="#FFBB28"),
    CalorieData(name="間食", value=120, color="#FF6B9D"),
]

# 食事メニューデータベース（モック）
food_menu = [
    # 主食
    FoodMenu(id=1, name="白米", calories_per_serving=168, category="主食", serving_unit="1杯(100g)"),
    FoodMenu(id=2, name="玄米", calories_per_serving=165, category="主食", serving_unit="1杯(100g)"),
    FoodMenu(id=3, name="食パン", calories_per_serving=264, category="主食", serving_unit="1枚(6枚切り)"),
    FoodMenu(id=4, name="うどん", calories_per_serving=105, category="主食", serving_unit="1玉(100g)"),
    FoodMenu(id=5, name="そば", calories_per_serving=132, category="主食", serving_unit="1玉(100g)"),
    FoodMenu(id=6, name="パスタ", calories_per_serving=149, category="主食", serving_unit="100g"),
    
    # 主菜
    FoodMenu(id=7, name="鶏むね肉(焼き)", calories_per_serving=191, category="主菜", serving_unit="100g"),
    FoodMenu(id=8, name="鶏もも肉(焼き)", calories_per_serving=200, category="主菜", serving_unit="100g"),
    FoodMenu(id=9, name="豚ロース肉(焼き)", calories_per_serving=263, category="主菜", serving_unit="100g"),
    FoodMenu(id=10, name="牛肉(赤身)", calories_per_serving=201, category="主菜", serving_unit="100g"),
    FoodMenu(id=11, name="焼き魚(鮭)", calories_per_serving=138, category="主菜", serving_unit="1切れ(80g)"),
    FoodMenu(id=12, name="焼き魚(サバ)", calories_per_serving=202, category="主菜", serving_unit="1切れ(80g)"),
    FoodMenu(id=13, name="卵焼き", calories_per_serving=151, category="主菜", serving_unit="卵2個分"),
    FoodMenu(id=14, name="納豆", calories_per_serving=100, category="主菜", serving_unit="1パック"),
    FoodMenu(id=15, name="豆腐", calories_per_serving=56, category="主菜", serving_unit="100g"),
    
    # 副菜
    FoodMenu(id=16, name="サラダ(ミックス)", calories_per_serving=20, category="副菜", serving_unit="1皿"),
    FoodMenu(id=17, name="野菜炒め", calories_per_serving=80, category="副菜", serving_unit="1皿"),
    FoodMenu(id=18, name="ほうれん草のおひたし", calories_per_serving=25, category="副菜", serving_unit="1皿"),
    FoodMenu(id=19, name="きんぴらごぼう", calories_per_serving=58, category="副菜", serving_unit="1皿"),
    FoodMenu(id=20, name="ポテトサラダ", calories_per_serving=122, category="副菜", serving_unit="1皿"),
    
    # 汁物
    FoodMenu(id=21, name="味噌汁", calories_per_serving=25, category="汁物", serving_unit="1杯"),
    FoodMenu(id=22, name="野菜スープ", calories_per_serving=30, category="汁物", serving_unit="1杯"),
    FoodMenu(id=23, name="コンソメスープ", calories_per_serving=35, category="汁物", serving_unit="1杯"),
    
    # デザート
    FoodMenu(id=24, name="りんご", calories_per_serving=54, category="デザート", serving_unit="1個(中)"),
    FoodMenu(id=25, name="バナナ", calories_per_serving=86, category="デザート", serving_unit="1本"),
    FoodMenu(id=26, name="ヨーグルト", calories_per_serving=62, category="デザート", serving_unit="100g"),
]

# 運動メニューのモックデータ
workout_menu = [
    # 有酸素運動
    WorkoutMenu(id=1, name="ウォーキング", calories_per_minute=4.5, category="有酸素運動", intensity="軽度"),
    WorkoutMenu(id=2, name="ジョギング", calories_per_minute=8.0, category="有酸素運動", intensity="中度"),
    WorkoutMenu(id=3, name="ランニング", calories_per_minute=12.0, category="有酸素運動", intensity="高度"),
    WorkoutMenu(id=4, name="サイクリング", calories_per_minute=6.5, category="有酸素運動", intensity="中度"),
    WorkoutMenu(id=5, name="水泳", calories_per_minute=10.0, category="有酸素運動", intensity="高度"),
    WorkoutMenu(id=6, name="エアロビクス", calories_per_minute=7.0, category="有酸素運動", intensity="中度"),
    WorkoutMenu(id=7, name="縄跳び", calories_per_minute=11.0, category="有酸素運動", intensity="高度"),
    
    # 筋力トレーニング
    WorkoutMenu(id=8, name="腕立て伏せ", calories_per_minute=5.5, category="筋力トレーニング", intensity="中度"),
    WorkoutMenu(id=9, name="腹筋", calories_per_minute=4.5, category="筋力トレーニング", intensity="中度"),
    WorkoutMenu(id=10, name="スクワット", calories_per_minute=6.0, category="筋力トレーニング", intensity="中度"),
    WorkoutMenu(id=11, name="ダンベル", calories_per_minute=5.0, category="筋力トレーニング", intensity="中度"),
    WorkoutMenu(id=12, name="懸垂", calories_per_minute=7.0, category="筋力トレーニング", intensity="高度"),
    WorkoutMenu(id=13, name="プランク", calories_per_minute=3.5, category="筋力トレーニング", intensity="軽度"),
    
    # ストレッチ
    WorkoutMenu(id=14, name="全身ストレッチ", calories_per_minute=2.5, category="ストレッチ", intensity="軽度"),
    WorkoutMenu(id=15, name="ヨガ", calories_per_minute=3.0, category="ストレッチ", intensity="軽度"),
    WorkoutMenu(id=16, name="ピラティス", calories_per_minute=3.5, category="ストレッチ", intensity="軽度"),
    
    # 球技
    WorkoutMenu(id=17, name="テニス", calories_per_minute=7.5, category="球技", intensity="中度"),
    WorkoutMenu(id=18, name="バスケットボール", calories_per_minute=8.5, category="球技", intensity="高度"),
    WorkoutMenu(id=19, name="サッカー", calories_per_minute=9.0, category="球技", intensity="高度"),
    WorkoutMenu(id=20, name="バドミントン", calories_per_minute=6.0, category="球技", intensity="中度"),
    
    # その他
    WorkoutMenu(id=21, name="階段昇降", calories_per_minute=8.0, category="その他", intensity="中度"),
    WorkoutMenu(id=22, name="掃除", calories_per_minute=3.0, category="その他", intensity="軽度"),
    WorkoutMenu(id=23, name="庭仕事", calories_per_minute=4.0, category="その他", intensity="軽度"),
    WorkoutMenu(id=24, name="ダンス", calories_per_minute=6.5, category="その他", intensity="中度"),
]

workout_records = [
    WorkoutRecord(
        id=1,
        date="2024-03-20",
        total_calories_burned=150,
        exercises=[
            WorkoutItem(workout_id=1, duration_minutes=30),
            WorkoutItem(workout_id=14, duration_minutes=10),
        ]
    ),
]

meal_records = [
    MealRecord(
        id=1, 
        time="07:30", 
        meal="朝食", 
        calories=350, 
        items=[
            MealItem(food_id=1, servings=1.0),  # 白米 1杯
            MealItem(food_id=21, servings=1.0), # 味噌汁 1杯
            MealItem(food_id=13, servings=1.0)  # 卵焼き 1個分
        ], 
        date=date.today().strftime("%Y-%m-%d")
    ),
    MealRecord(
        id=2, 
        time="12:30", 
        meal="昼食", 
        calories=650, 
        items=[
            MealItem(food_id=1, servings=1.5),  # 白米 1.5杯
            MealItem(food_id=8, servings=1.0),  # 鶏もも肉 100g
            MealItem(food_id=16, servings=1.0)  # サラダ 1皿
        ], 
        date=date.today().strftime("%Y-%m-%d")
    ),
    MealRecord(
        id=3, 
        time="19:00", 
        meal="夕食", 
        calories=580, 
        items=[
            MealItem(food_id=1, servings=1.0),  # 白米 1杯
            MealItem(food_id=11, servings=1.0), # 焼き魚(鮭) 1切れ
            MealItem(food_id=17, servings=1.0)  # 野菜炒め 1皿
        ], 
        date=date.today().strftime("%Y-%m-%d")
    ),
]

activity_data = ActivityData(
    steps=8234,
    water_glasses=6,
    health_score=85
)

# API エンドポイント
@app.get("/")
async def root():
    return {"message": "ぶいざっぷ API is running"}

@app.get("/api/user", response_model=User)
async def get_user(user_id: int = 1):
    """ユーザー情報を取得"""
    try:
        user_data = db.get_user_by_id(user_id)
        if user_data:
            return User(
                id=user_data['user_id'],
                name=f"{user_data['first_name']} {user_data['last_name']}",
                age=2025 - user_data['birth_date'].year,  # 簡易計算
                height=float(user_data['height']),
                current_weight=float(user_data['initial_weight']),  # 最新体重は別途取得が必要
                target_weight=float(user_data['target_weight']) if user_data['target_weight'] else 65.0,
                daily_calorie_goal=user_data['daily_calorie_goal'] or 2000,
                avatar="/api/placeholder/64/64"
            )
        else:
            # データベースに接続できない場合はモックデータを返す
            return mock_user
    except Exception as e:
        print(f"Database error: {e}")
        return mock_user

@app.get("/api/weight-data", response_model=List[WeightRecord])
async def get_weight_data():
    """体重推移データを取得"""
    return weight_data

@app.get("/api/calorie-data", response_model=List[CalorieData])
async def get_calorie_data():
    """カロリー摂取データを取得"""
    return calorie_data

@app.get("/api/food-menu", response_model=List[FoodMenu])
async def get_food_menu():
    """食事メニューを取得"""
    try:
        meal_data = db.get_meal_master()
        if meal_data:
            food_menu_db = []
            for meal in meal_data:
                food_menu_db.append(FoodMenu(
                    id=meal['meal_id'],
                    name=meal['meal_name'],
                    calories_per_serving=meal['calories_per_100g'],
                    category=meal.get('category', 'その他'),
                    serving_unit="100g"
                ))
            return food_menu_db
        else:
            return food_menu
    except Exception as e:
        print(f"Database error: {e}")
        return food_menu

@app.get("/api/food-menu/category/{category}", response_model=List[FoodMenu])
async def get_food_menu_by_category(category: str):
    """カテゴリ別の食事メニューを取得"""
    return [food for food in food_menu if food.category == category]

@app.get("/api/meals", response_model=List[MealRecord])
async def get_meals(date: Optional[str] = None):
    """食事記録を取得"""
    if date:
        return [meal for meal in meal_records if meal.date == date]
    return meal_records

@app.post("/api/meals", response_model=MealRecord)
async def add_meal(meal_input: MealRecordInput):
    """食事記録を追加"""
    # カロリー計算
    total_calories = 0
    
    # データベースから食事メニューを取得
    try:
        meal_data = db.get_meal_master()
        db_food_menu = {}
        if meal_data:
            for meal in meal_data:
                db_food_menu[meal['meal_id']] = meal['calories_per_100g']
        
        # カロリー計算
        for item in meal_input.items:
            if item.food_id in db_food_menu:
                total_calories += int(db_food_menu[item.food_id] * item.servings)
            else:
                # フォールバック: モックデータから検索
                food = next((f for f in food_menu if f.id == item.food_id), None)
                if food:
                    total_calories += int(food.calories_per_serving * item.servings)
    except Exception as e:
        print(f"Database error in add_meal: {e}")
        # フォールバック: モックデータを使用
        for item in meal_input.items:
            food = next((f for f in food_menu if f.id == item.food_id), None)
            if food:
                total_calories += int(food.calories_per_serving * item.servings)
    
    new_meal = MealRecord(
        id=len(meal_records) + 1,
        time=meal_input.time,
        meal=meal_input.meal,
        calories=total_calories,
        items=meal_input.items,
        date=meal_input.date
    )
    
    meal_records.append(new_meal)
    return new_meal

@app.get("/api/workout-menu", response_model=List[WorkoutMenu])
async def get_workout_menu():
    """運動メニューを取得"""
    try:
        exercise_data = db.get_exercise_master()
        if exercise_data:
            workout_menu_db = []
            for exercise in exercise_data:
                workout_menu_db.append(WorkoutMenu(
                    id=exercise['exercise_id'],
                    name=exercise['exercise_name'],
                    calories_per_minute=float(exercise['met_value']) * 1.17,  # 70kg体重での概算
                    category=exercise.get('category', 'その他'),
                    intensity="中程度"
                ))
            return workout_menu_db
        else:
            return workout_menu
    except Exception as e:
        print(f"Database error: {e}")
        return workout_menu

@app.get("/api/workout-menu/category/{category}", response_model=List[WorkoutMenu])
async def get_workout_menu_by_category(category: str):
    """カテゴリ別の運動メニューを取得"""
    return [workout for workout in workout_menu if workout.category == category]

@app.get("/api/workouts", response_model=List[WorkoutRecord])
async def get_workouts(date: Optional[str] = None):
    """運動記録を取得"""
    if date:
        return [workout for workout in workout_records if workout.date == date]
    return workout_records

@app.post("/api/workouts", response_model=WorkoutRecord)
async def add_workout(workout_input: WorkoutRecordInput):
    """運動記録を追加"""
    # カロリー消費計算
    total_calories_burned = 0
    
    # データベースから運動メニューを取得
    try:
        exercise_data = db.get_exercise_master()
        db_workout_menu = {}
        if exercise_data:
            for exercise in exercise_data:
                calories_per_minute = float(exercise['met_value']) * 1.17  # 70kg体重での概算
                db_workout_menu[exercise['exercise_id']] = calories_per_minute
        
        # カロリー消費計算
        for item in workout_input.exercises:
            if item.workout_id in db_workout_menu:
                total_calories_burned += int(db_workout_menu[item.workout_id] * item.duration_minutes)
            else:
                # フォールバック: モックデータから検索
                workout = next((w for w in workout_menu if w.id == item.workout_id), None)
                if workout:
                    total_calories_burned += int(workout.calories_per_minute * item.duration_minutes)
    except Exception as e:
        print(f"Database error in add_workout: {e}")
        # フォールバック: モックデータを使用
        for item in workout_input.exercises:
            workout = next((w for w in workout_menu if w.id == item.workout_id), None)
            if workout:
                total_calories_burned += int(workout.calories_per_minute * item.duration_minutes)
    
    new_workout = WorkoutRecord(
        id=len(workout_records) + 1,
        date=workout_input.date,
        total_calories_burned=total_calories_burned,
        exercises=workout_input.exercises
    )
    
    workout_records.append(new_workout)
    return new_workout

@app.get("/api/today-workouts")
async def get_today_workouts():
    """今日の総消費カロリーを取得"""
    today = date.today().strftime("%Y-%m-%d")
    today_workouts = [workout for workout in workout_records if workout.date == today]
    total_calories_burned = sum(workout.total_calories_burned for workout in today_workouts)
    return {"total_calories_burned": total_calories_burned}

@app.get("/api/activity", response_model=ActivityData)
async def get_activity():
    """今日のアクティビティデータを取得"""
    return activity_data

@app.get("/api/today-calories")
async def get_today_calories():
    """今日の総摂取カロリーを取得"""
    today = date.today().strftime("%Y-%m-%d")
    today_meals = [meal for meal in meal_records if meal.date == today]
    total_calories = sum(meal.calories for meal in today_meals)
    return {"total_calories": total_calories}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
