from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
import json

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
async def get_user():
    """ユーザー情報を取得"""
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
