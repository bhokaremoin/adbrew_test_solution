from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
from bson import ObjectId

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todos_collection = db.todos

class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        try:
            todos = list(todos_collection.find())
            for todo in todos:
                todo['_id'] = str(todo['_id'])
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Fetching Todos Error : {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        try:
            todo_data = json.loads(request.body)
            todos_collection.insert_one(todo_data)
            todo_data['_id'] = str(todo_data['_id'])
            return Response({"message": "Todo Insertion Successfully", "todo_item": todo_data},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            logging.error(f"Inserting Todos Error : {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            body = json.loads(request.body)
            todo_id = body.get('id')
            if not todo_id:
                return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            result = todos_collection.delete_one({'_id': ObjectId(todo_id)})
            if result.deleted_count == 1:
                return Response({}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logging.error(f"Error deleting todo: {e}")
            return Response({"error": "Error deleting todo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
