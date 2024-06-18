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
        if(newTodoDescription.length === 0){
            toast.error("Please enter a description.");
            return
        }
        if(newTodoDescription.length > 200){
            toast.error("Description cannot exceed 200 characters.");
            return;
        }
        toAddTodo({"description" : newTodoDescription}).then().catch();
        setNewTodoDescription('');
    }

    const handleDeleteTodo = (id) => {
        toDeleteTodo(id).then().catch();
    }
    return <div>
        <div className={'todo_container'}>
            <h1 className={'heading'}>Todos List</h1>
            <div className={'add_todo_container'}>
                <input className={'add_todo_input'}
                   type="text" value={newTodoDescription}
                   onChange={(e) => setNewTodoDescription(e.target.value)}
                   placeholder={'Add Todo'}/>
                <img src={'/add_icon.svg'} onClick={handleAddTodo}/>
            </div>
            <div className={'todo_list'}>
                {((todos && todos.length > 0) ? todos.map((todo, index) => (
                    <div key={todo._id} className={`todo_item ${index%2 === 1 ? 'grey_bg' : ''}`}>
                        <span>{todo.description}</span>
                        <img src={'/cross_icon.svg'} onClick={() => handleDeleteTodo(todo._id)}/>
                    </div>))
                        :
                        <h3>No Todos ...</h3>
                )}
            </div>
        </div>
        <ToastContainer/>
    </div>
}

export default Home