class ToDoList extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      newToDoText: '',
      todoItems: [
          /*{id: 1, text: 'Text item 1', category: "active"},
          {id: 2, text: 'Text item 6 - completed', category: "complete"},
          {id: 3, text: 'Text item 7 - deleted', category: "delete"},*/
      ],
      currentCategory: 'active'
    }
  }

  componentDidMount = () => {
     this.setState({...JSON.parse(localStorage.getItem('state'))})
  }

  saveToLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  changeToDoText = (e) => {
    this.setState({newToDoText: e.target.value})
    this.saveToLocalStorage();
  }

  changeCurrentCategory = (e) => {
    this.setState({currentCategory: e.target.value})
    this.saveToLocalStorage();
  }

  addItem = () =>{
    if(this.state.newToDoText){
      let newToDo = {
        id: this.state.todoItems.length + 1, 
        text: this.state.newToDoText, 
        category: "active"
      };

      this.setState({
        todoItems: [...this.state.todoItems, newToDo],
        newToDoText: ''
      });
    }
    this.saveToLocalStorage();
  }

  
  changeToDoList = (actionObject) => {
    let items = this.state.todoItems.map(elem => {
      if(elem.id === actionObject.id){
        if(actionObject.type == 'delete' && elem.category == 'delete'){
          elem.category = 'deleted';
        }
        else{
          elem.category = actionObject.type;
        }
      }
      return elem;
    });

    items.filter(elem => elem.category !== 'deleted');

    this.setState({
      todoItems: [...items]
    })

    this.saveToLocalStorage();
  }

  getActiveItems = () => {
    return this.state.todoItems.filter((elem) => elem.category == 'active').length
  }


  render(){
    let todoItems = this.state.todoItems.filter((td)=> td.category == this.state.currentCategory);

    return(
      <div className="todoListWrapper">
        <div className="todoInputWrapper">
          <div className="todoInput">
            <input type="text" 
                   placeholder="What to do" 
                   value={this.state.newToDoText} 
                   onChange={this.changeToDoText} 
                   disabled={(this.state.currentCategory == 'active') ? '' : 'disabled'}
                   
            />
            <button onClick={this.addItem}> + </button>
          </div>
          <select value={this.state.currentCategory} onChange={this.changeCurrentCategory}>
            <option value="active">Active</option>
            <option value="complete">Completed</option>
            <option value="delete">Deleted</option>
          </select>
        </div>

        <div className="todoList">
          {
            todoItems.map(td => {
              return (
                <div className="todoItem" key={td.id}>
                    <span>{td.text}</span>

                    <button className="btn red" onClick={()=>{this.changeToDoList({type: 'delete', id: td.id})}}>Delete</button>
                    <button className={`btn ${td.category == "active" ? 'green' : 'blue'}`} 
                      onClick={()=>{
                            if(td.category == "active"){
                              this.changeToDoList({type: 'complete', id: td.id})
                            }
                            else{
                              this.changeToDoList({type: 'active', id: td.id})
                            }
                          }
                    }>
                    {td.category == "active" ? 'Complete' : "Return"}
                    </button>
                </div>
              )
            })
          }
          <p>You have {this.getActiveItems()} pending tasks.</p>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <ToDoList />,
  document.getElementById('app')
);