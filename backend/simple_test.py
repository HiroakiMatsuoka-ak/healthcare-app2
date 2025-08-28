import json
import urllib.request

def test_api_simple():
    try:
        # Test food menu API
        with urllib.request.urlopen("http://localhost:8000/api/food-menu") as response:
            food_data = json.loads(response.read().decode())
            print(f"Food Menu API - Status: {response.status}")
            print(f"Food items count: {len(food_data)}")
            if len(food_data) > 0:
                print(f"First food item: {food_data[0]}")
                print(f"Categories found: {set(item.get('category') for item in food_data)}")
        
        print("\n" + "="*50 + "\n")
        
        # Test workout menu API
        with urllib.request.urlopen("http://localhost:8000/api/workout-menu") as response:
            workout_data = json.loads(response.read().decode())
            print(f"Workout Menu API - Status: {response.status}")
            print(f"Workout items count: {len(workout_data)}")
            if len(workout_data) > 0:
                print(f"First workout item: {workout_data[0]}")
                print(f"Categories found: {set(item.get('category') for item in workout_data)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_simple()
