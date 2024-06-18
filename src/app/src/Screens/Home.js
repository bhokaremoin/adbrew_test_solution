import {useEffect, useState} from "react";
import {addTodo, deleteTodo, getAllTodos} from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodoDescription, setNewTodoDescription] = useState('');

    useEffect(()=>{
        toGetAllTodos().then().catch();
    },[]);

    async function toGetAllTodos() {
        try {
            const response = await getAllTodos();
            if(response.status === 200){
                setTodos(response.data);
            }
        }
        catch(error){
            toast.error("Error in Fetching Todos");
            console.error(error);
        }
    }

    async function toAddTodo(payload) {
        try {
            const response = await addTodo(payload);
            if(response){
                toGetAllTodos().then().catch();
                toast.success("Todo added successfully");
            }
        }
        catch(error){
            toast.error("Error in Adding Todo");
            console.error(error);
        }
    }

    async function toDeleteTodo(payload) {
        try {
            const response = await deleteTodo(payload);
            if(response){
                toGetAllTodos().then().catch();
                toast.success('Todo deleted!');
            }
        }
        catch(error){
            toast.error("Deleting Todo Failed !");
            console.error(error);
        }
    }

    const handleAddTodo = () => {
        toAddTodo({"description" : newTodoDescription}).then().catch();
        setNewTodoDescription('');
    }

    const handleDeleteTodo = (id) => {
        toDeleteTodo(id).then().catch();
    }

    return <div>
        <div>
            <h1>Todo List</h1>
            <div>
                {((todos && todos.length > 0) && todos.map((todo, index) => (
                <li key={todo._id}>
                    <span>
                    {todo.description}</span>
                    <button onClick={() => handleDeleteTodo(todo._id)}>x</button>
                </li>)))}
            </div>
        </div>
        <div>
            <span>Add Todo</span>
                <input type="text" value={newTodoDescription}
                       onChange={(e) => setNewTodoDescription(e.target.value)}
                       placeholder={'Enter Description'}/>
                <button onClick={handleAddTodo}>+</button>
        </div>
        <ToastContainer />
    </div>
}

export default Home