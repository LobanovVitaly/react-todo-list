//import {useEffect, useState} from "react";
const { useEffect, useState } = React;


const ToDoList = () => {

  const [tasks, setTasks] = useState([]);

  const [newInputText, setNewInputText] = useState('');

  const [tasksIsChecked, setTasksIsChecked]  = useState(false);
  
  useEffect(()=>{
    let loadedTasks = JSON.parse(localStorage.getItem('tasks'));
    setTasks(loadedTasks);

    setTasksIsChecked(localStorage.getItem('tasksIsChecked'));
  }, []);

  useEffect(()=>{
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    let isCheckedLength = tasks.filter(elem => elem.checked).length;
    setTasksIsChecked(isCheckedLength? true : false);
    localStorage.setItem('tasksIsChecked', tasksIsChecked);
  }, [tasks]);

  const inputChange = (e) => {
    setNewInputText(e.target.value);
  }

  const addNewTask = () => {
    if(newInputText.length){

      setTasks(prev => [
          ...prev, 
          {
            id: tasks.length? (tasks[tasks.length-1].id + 1) : 1,
            title: newInputText,
            checked: false
          }
        ]
      );
      setNewInputText('');
    }
  }

  const taskCompleted = (id) => {
    setTasks(tasks.map(elem => {
      if(elem.id == id){
          return {
            ...elem,
            completed: !elem.completed
          }
        }
        return elem;
      })
    );
  }

  const deleteTask = (...ids) => {
    setTasks(tasks.filter(elem => {
        return !ids.includes(elem.id)
      })
    );
  }

  const selectTask = (id) => {
    setTasks(tasks.map(elem => {
        if(elem.id == id){
          return {
            ...elem,
            checked: !elem.checked
          }
        }
        return elem;
      })
    );
  }

  const completeSelected = () => {
    setTasks(
      tasks.map(elem => {
        if(elem.checked){
          return {
            ...elem,
            completed: true,
            checked: false
          }
        }
        return elem;
      })
    );
  }

  const deleteSelected = () => {
    setTasks(
      tasks.filter(elem => !elem.checked)
    );
  }

  const clearSelected = () => {
    setTasks(
      tasks.map(elem => {
          return {
            ...elem,
            checked: false
          }
      })
    );
  }

  let tasksElements = tasks.map(elem => {
    return (
        <div key={elem.id} 
             className={`toDoItem ${elem.completed? 'completed' : ''}`} 
             onClick={()=>{taskCompleted(elem.id)}}
        >
          <input type="checkbox" 
            onChange={(e) => {e.stopPropagation(); selectTask(elem.id)}}
            checked={elem.checked ? 'checked' : ''}
          />
          <p>{elem.title}</p>

          <button 
            className="deleteToDoItemBtn"
            onClick={(e)=> {e.stopPropagation(); deleteTask(elem.id)}}
          >&times;
          </button>
        </div>
      );
  });

  return (
      <div className="toDoListWrapperOuter">
        <div className="toDoInputWrapper">
          <input 
            value={newInputText}
            onChange={inputChange}
            placeholder="Title of new task"
          />
          <button onClick={addNewTask}>Add new</button>
        </div>

        <div className="toDoListWrapper">
          {tasksElements}
        </div>

        {tasksIsChecked && 
        <div className="toDoListButtons">
          <button className="clearSelected" onClick={clearSelected}>Clear selected</button>
          <button className="completeBtn" onClick={completeSelected}>Complete selected</button>
          <button className="deleteBtn" onClick={deleteSelected}>Delete selected</button>  
        </div>
        }
      </div>
    );
}


ReactDOM.render(
  <ToDoList />,
  document.getElementById('app')
);