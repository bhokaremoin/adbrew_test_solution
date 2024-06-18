import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export function getAllTodos(){
    return api.get('/todos');
}

export function addTodo(payload){
    return api.post('/todos/', payload);
}

export function deleteTodo(id){
    return api.delete(`/todos/${id}`);
}