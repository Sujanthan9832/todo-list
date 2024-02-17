import { useEffect, useState } from 'react';
import './App.css';
import { MdDelete } from "react-icons/md";
import { FaCheck, FaEdit } from "react-icons/fa";

const App = () => {
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);
    const [allTodos, setAllTodos] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [completedTodos, setCompletedTodos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const handleAddTodo = () => {
        // To Validate the title field, it shold not be empty
        if (newTitle.trim() === "") {
            alert("Title cannot be empty");
            return;
        }

        if (editIndex !== null) {
            // Editing an existing todo
            let updatedTodoArr = [...allTodos];
            updatedTodoArr[editIndex] = { title: newTitle, description: newDescription };
            setAllTodos(updatedTodoArr);
            setEditIndex(null);
        } else {

            let newTodoItem = {
                title: newTitle,
                description: newDescription
            }

            let updatedTodoArr = [...allTodos];
            updatedTodoArr.push(newTodoItem);
            setAllTodos(updatedTodoArr);
        }

        setNewTitle("");
        setNewDescription("");
        localStorage.setItem('todolist', JSON.stringify(allTodos));
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setNewTitle(allTodos[index].title);
        setNewDescription(allTodos[index].description);
    };

    useEffect(() => {
        //check the local storage and load it
        let savedTodos = JSON.parse(localStorage.getItem('todolist'));
        let savedCompletedTodos = JSON.parse(localStorage.getItem('completedTodolist'));
        if (savedTodos) {
            setAllTodos(savedTodos);
        }
        if (savedCompletedTodos) {
            setCompletedTodos(savedCompletedTodos);
        }
    }, []);

    const handleDelete = (index) => {
        let reducedTodoList = [...allTodos];
        reducedTodoList.splice(index, 1);

        localStorage.setItem('todolist', JSON.stringify(reducedTodoList));
        setAllTodos(reducedTodoList);
    }

    const handleCompletedDelete = (index) => {
        let completedTodoList = [...completedTodos];
        completedTodoList.splice(index, 1);

        localStorage.setItem('completedTodolist', JSON.stringify(completedTodoList));
        setCompletedTodos(completedTodoList);
    }

    const handleCompleted = index => {
        let now = new Date();
        let dd = now.getDate();
        let mm = now.getMonth();
        let yy = now.getFullYear();

        let completedDate = dd + '-' + mm + '-' + yy;

        let filteredItem = {
            ...allTodos[index],
            completedOn: completedDate,
        };

        let updateCompletedArr = [...completedTodos];
        updateCompletedArr.push(filteredItem);
        setCompletedTodos(updateCompletedArr);
        localStorage.setItem('completedTodolist', JSON.stringify(updateCompletedArr));

        handleDelete(index);
    }

    return (
        <div className='App'>
            <div className='top-section'>
                <h1>To Do</h1>
            </div>

            <div className='todo-wrapper'>
                <div className='todo-input'>
                    <div className='todo-input-item'>
                        <label>Title</label>
                        <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='input the task' required />
                    </div>

                    <div className='todo-input-item'>
                        <label>Description</label>
                        <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='input the description' />
                    </div>

                    <div className='todo-input-item'>
                        <button type='button' onClick={handleAddTodo} className='primarybtn' >Add</button>
                    </div>
                </div>

                <div className='btn-area'>
                    <button type='button' className={`secondarybtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>
                        ToDo
                    </button>
                    <button type='button' className={`secondarybtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>
                        Completed
                    </button>
                </div>

                <div className='todo-list'>
                    {/*to only show to do list*/}
                    {isCompleteScreen === false && allTodos.map((item, index) => {
                        return (
                            <div className='todo-list-item' key={index}>

                                <div className='todo-detail'>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>

                                <div className='icon-box'>
                                    <FaEdit className='eicon' onClick={() => handleEdit(index)} />
                                    <MdDelete className='icon' onClick={() => handleDelete(index)} />
                                    <FaCheck className='cicon' onClick={() => handleCompleted(index)} />
                                </div>

                            </div>
                        );
                    })}

                    {/*to only show completed to do list*/}

                    {isCompleteScreen === true && completedTodos.map((item, index) => {
                        return (
                            <div className='todo-list-item' key={index}>

                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p><small>Completed On : {item.completedOn}</small></p>
                                </div>

                                <div>
                                    <MdDelete className='icon' onClick={() => handleCompletedDelete(index)} />
                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default App;