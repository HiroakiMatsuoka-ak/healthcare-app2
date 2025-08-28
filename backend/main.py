from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
import json

app = FastAPI(title="Healthcare App API", version="1.0.0")

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

class MealRecord(BaseModel):
    id: int
    time: str
    meal: str
    calories: int
    items: str
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

meal_records = [
    MealRecord(id=1, time="07:30", meal="朝食", calories=350, items="ご飯、味噌汁、卵焼き", date="2025-08-27"),
    MealRecord(id=2, time="12:30", meal="昼食", calories=650, items="親子丼、サラダ", date="2025-08-27"),
    MealRecord(id=3, time="19:00", meal="夕食", calories=580, items="焼き魚、野菜炒め、ご飯", date="2025-08-27"),
]

activity_data = ActivityData(
    steps=8234,
    water_glasses=6,
    health_score=85
)

# API エンドポイント
@app.get("/")
async def root():
    return {"message": "Healthcare App API is running"}

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

@app.get("/api/meals", response_model=List[MealRecord])
async def get_meals(date: Optional[str] = None):
    """食事記録を取得"""
    if date:
        return [meal for meal in meal_records if meal.date == date]
    return meal_records

@app.post("/api/meals", response_model=MealRecord)
async def add_meal(meal: MealRecord):
    """食事記録を追加"""
    meal.id = len(meal_records) + 1
    meal_records.append(meal)
    return meal

@app.get("/api/activity", response_model=ActivityData)
async def get_activity():
    """今日のアクティビティデータを取得"""
    return activity_data

@app.get("/api/today-calories")
async def get_today_calories():
    """今日の総摂取カロリーを取得"""
    today = "2025-08-27"  # テスト用の固定日付
    today_meals = [meal for meal in meal_records if meal.date == today]
    total_calories = sum(meal.calories for meal in today_meals)
    return {"total_calories": total_calories}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
