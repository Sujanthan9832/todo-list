import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { MdDelete } from "react-icons/md";
import { FaCheck, FaEdit } from "react-icons/fa";

const App = () => {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");

  const handleAddTodo = () => {
    // To Validate the title field, it shold not be empty
    if (newTitle.trim() === "") {
      alert("Title cannot be empty");
      return;
    }

    if (editIndex !== null) {
      // Editing an existing todo
      let updatedTodoArr = [...allTodos];
      updatedTodoArr[editIndex] = { title: newTitle, description: newDescription, priority: priority, category: category, dueDate: dueDate };
      setAllTodos(updatedTodoArr);
      setEditIndex(null);
    } else {

      let newTodoItem = {
        title: newTitle,
        description: newDescription,
        priority: priority,
        category: category,
        dueDate: dueDate,
      }

      let updatedTodoArr = [...allTodos];
      updatedTodoArr.push(newTodoItem);
      setAllTodos(updatedTodoArr);
    }

    setNewTitle("");
    setNewDescription("");
    setPriority("low");
    setCategory("personal");
    setDueDate("");
    localStorage.setItem('todolist', JSON.stringify(allTodos));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewTitle(allTodos[index].title);
    setNewDescription(allTodos[index].description);
    setPriority(allTodos[index].priority);
    setCategory(allTodos[index].category);
    setDueDate(allTodos[index].dueDate);
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
      <Header />
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='firstrow'>
            <div className='todo-input-item'>
              <label>Title</label>
              <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='input the task' required />
            </div>

            <div className='todo-input-item'>
              <label>Description</label>
              <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='input the description' />
            </div>
          </div>

          <div className='secondrow'>
            <div className='todo-input-item-radio'>
              <label>Priority:</label>
              <div className='priority-radio'>
                <label>
                  <input className='radio-btn' type='radio' value='low' checked={priority === 'low'} onChange={() => setPriority('low')} />
                  Low
                </label>
                <label>
                  <input className='radio-btn' type='radio' value='high' checked={priority === 'high'} onChange={() => setPriority('high')} />
                  High
                </label>
              </div>
            </div>

            <div className='todo-input-item-dropdown'>
              <label>Category:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value='personal'>Personal</option>
                <option value='work'>Work</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='todo-input-item'>
              <label>Due Date:</label>
              <input
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

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
            const priorityStyle = item.priority === 'high' ? { color: 'red' } : {};
            return (
              <div className='todo-list-item' key={index}>

                <div className='todo-detail'>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className='taskDetails'>
                    <p><small><b>Status :</b>In Progress</small></p>
                    <p><small><b>Category:</b> {item.category}</small></p>
                    <p style={priorityStyle}><small><b>Priority :</b> {item.priority}</small></p>
                    <p><small><b>Due Date:</b> {item.dueDate}</small></p>
                  </div>

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
                  <p><small><b>Status :</b>Completed On {item.completedOn}</small></p>
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