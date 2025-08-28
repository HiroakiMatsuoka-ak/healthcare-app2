import urllib.request
import json

def test_api(url, name):
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"\n{name} API Response:")
            print(f"Status: {response.status}")
            print(f"Data type: {type(data)}")
            print(f"Data length: {len(data) if isinstance(data, list) else 'N/A'}")
            if isinstance(data, list) and len(data) > 0:
                print(f"First item: {data[0]}")
            else:
                print(f"Data: {data}")
    except Exception as e:
        print(f"Error testing {name}: {e}")

if __name__ == "__main__":
    test_api("http://localhost:8000/api/food-menu", "Food Menu")
    test_api("http://localhost:8000/api/workout-menu", "Workout Menu")
