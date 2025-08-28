import mysql.connector
import os
from typing import Optional

class DatabaseConnection:
    def __init__(self):
        self.config = {
            'host': 'localhost',
            'port': 3307,
            'database': 'healthcare_db',
            'user': 'healthcare_user',
            'password': 'healthcare_pass_2025',
            'charset': 'utf8mb4',
            'autocommit': True
        }
        self.connection = None
        self.is_db_available = False
        
        # Try to connect on initialization
        self.connect()
    
    def connect(self):
        """データベースに接続"""
        try:
            self.connection = mysql.connector.connect(**self.config)
            self.is_db_available = True
            print("Database connection successful")
            return True
        except mysql.connector.Error as err:
            print(f"Database connection error: {err}")
            print("Using mock data instead")
            self.is_db_available = False
            return False
    
    def disconnect(self):
        """データベース接続を閉じる"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def execute_query(self, query: str, params: tuple = None):
        """クエリを実行"""
        if not self.is_db_available:
            return None
            
        if not self.connection or not self.connection.is_connected():
            if not self.connect():
                return None
        
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
            else:
                result = cursor.rowcount
            
            cursor.close()
            return result
        except mysql.connector.Error as err:
            print(f"Query execution error: {err}")
            self.is_db_available = False
            return None
    
    def get_users(self):
        """ユーザー一覧を取得"""
        query = "SELECT * FROM users WHERE is_active = TRUE"
        return self.execute_query(query)
    
    def get_user_by_id(self, user_id: int):
        """IDでユーザーを取得"""
        query = "SELECT * FROM users WHERE user_id = %s AND is_active = TRUE"
        result = self.execute_query(query, (user_id,))
        return result[0] if result else None
    
    def get_meal_master(self):
        """食事マスターを取得"""
        query = "SELECT * FROM meal_master WHERE is_active = TRUE ORDER BY category, meal_name"
        return self.execute_query(query)
    
    def get_exercise_master(self):
        """運動マスターを取得"""
        query = "SELECT * FROM exercise_master WHERE is_active = TRUE ORDER BY category, exercise_name"
        return self.execute_query(query)
    
    def add_user_meal(self, user_id: int, meal_id: int, meal_date: str, meal_time: str, 
                      serving_size: float, meal_category: str, notes: str = None):
        """ユーザー食事記録を追加"""
        # 食事マスターから栄養情報を取得
        meal_info = self.execute_query("SELECT * FROM meal_master WHERE meal_id = %s", (meal_id,))
        if not meal_info:
            return None
        
        meal_data = meal_info[0]
        actual_calories = int((meal_data['calories_per_100g'] * serving_size) / 100)
        actual_protein = (meal_data.get('protein_per_100g', 0) * serving_size) / 100 if meal_data.get('protein_per_100g') else None
        
        query = """
        INSERT INTO user_meals (user_id, meal_id, meal_date, meal_time, serving_size, 
                               actual_calories, actual_protein, meal_category, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        result = self.execute_query(query, (user_id, meal_id, meal_date, meal_time, 
                                          serving_size, actual_calories, actual_protein, 
                                          meal_category, notes))
        return result
    
    def add_user_exercise(self, user_id: int, exercise_id: int, exercise_date: str, 
                         start_time: str, duration_minutes: int, intensity: str, notes: str = None):
        """ユーザー運動記録を追加"""
        # 運動マスターから情報を取得
        exercise_info = self.execute_query("SELECT * FROM exercise_master WHERE exercise_id = %s", (exercise_id,))
        if not exercise_info:
            return None
        
        exercise_data = exercise_info[0]
        # 簡易的なカロリー計算（体重70kgと仮定）
        calories_burned = int(exercise_data['met_value'] * 70 * (duration_minutes / 60))
        
        query = """
        INSERT INTO user_exercises (user_id, exercise_id, exercise_date, start_time, 
                                   duration_minutes, intensity, calories_burned, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        result = self.execute_query(query, (user_id, exercise_id, exercise_date, start_time,
                                          duration_minutes, intensity, calories_burned, notes))
        return result

# グローバルデータベース接続インスタンス
db = DatabaseConnection()
