#!/usr/bin/env python3
"""
Test script for the Healthcare API endpoints
"""

import requests
import json
from datetime import date

API_BASE_URL = 'http://localhost:8000/api'

def test_food_menu():
    """Test food menu endpoint"""
    print("Testing food menu endpoint...")
    try:
        response = requests.get(f'{API_BASE_URL}/food-menu')
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Food menu items: {len(data)}")
            if data:
                print(f"First item: {data[0]}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_add_meal():
    """Test adding a meal"""
    print("\nTesting add meal endpoint...")
    meal_data = {
        "time": "12:00",
        "meal": "昼食",
        "items": [
            {"food_id": 1, "servings": 1.0},  # 白米
            {"food_id": 7, "servings": 1.0}   # 鶏むね肉
        ],
        "date": date.today().strftime("%Y-%m-%d")
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/meals', 
                               headers={'Content-Type': 'application/json'},
                               data=json.dumps(meal_data))
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Added meal: {data}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_workout_menu():
    """Test workout menu endpoint"""
    print("\nTesting workout menu endpoint...")
    try:
        response = requests.get(f'{API_BASE_URL}/workout-menu')
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Workout menu items: {len(data)}")
            if data:
                print(f"First item: {data[0]}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_add_workout():
    """Test adding a workout"""
    print("\nTesting add workout endpoint...")
    workout_data = {
        "date": date.today().strftime("%Y-%m-%d"),
        "exercises": [
            {"workout_id": 1, "duration_minutes": 30},  # ウォーキング
            {"workout_id": 8, "duration_minutes": 15}   # 腕立て伏せ
        ]
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/workouts', 
                               headers={'Content-Type': 'application/json'},
                               data=json.dumps(workout_data))
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Added workout: {data}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Healthcare API Test Script")
    print("=" * 50)
    
    test_food_menu()
    test_add_meal()
    test_workout_menu()
    test_add_workout()
    
    print("\nTest completed!")
