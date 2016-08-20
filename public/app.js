const TaskForm = React.createClass({
  getInitialState: function() {
      return {
        title: ''
      };
  },

  handleTitleChange: function(e){
    this.setState({title: e.target.value});
  },

  handlePriorityChange: function(e){
    this.setState({priority: e.target.value});
  },

  handleCreatedByChange: function(e){
    this.setState({createdBy: e.target.value});
  },

  handleAssignedToChange: function(e){
    this.setState({assignedTo: e.target.value});
  },

  handleSubmit: function(e){
    e.preventDefault();
    let title = this.state.title.trim();
    if (!title){
      return;
    }
    this.props.onCommentSubmit({title: title});
    this.setState({title: ''});
  },

  render: function(){
    return (
      <form className="taskForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
        <select value={this.state.priority} onChange={this.handlePriorityChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <input type="text" placeholder="Created By (full name)" value={this.state.createdBy} onChange={this.handleCreatedByChange} />
        <input type="text" placeholder="Assigned To (full name)" value={this.state.assignedTo} onChange={this.handleAssignedToChange} />
        <input type="submit" value="Post" />
      </form>
    );
  }
})

const MainBoard = React.createClass({
  loadMainBoard: function (){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        console.log(`success data: ${data}`);
        this.setState({data: data});
      }.bind(this)
    });
  },

  handleTaskSubmit: function(tasks){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: tasks,
      success: function(){
        this.loadMainBoard();
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
      return { data: [] };
  },

  componentDidMount: function() {
    this.loadMainBoard();
  },

  render: function(){
    return (
      <div className="mainBoard">
        <div>
          <h1>React Kanban</h1>
        </div>
        <div>
          <h2>Queue</h2>
            <CardList data={this.state.data}/>
        </div>
        <div>
          <h2>In Progress </h2>
        </div>
        <div>
          <h2>Done</h2>
        </div>
        <TaskForm onCommentSubmit={this.handleTaskSubmit} />
      </div>
    );
  }
});

const CardList = React.createClass({
  render: function(){
    console.log(`inside CardList: ${this.props.data}`);
    const taskNodes = this.props.data.map(function(tasks, index){
      return(
        <CardTasks
          key={index}
          title={tasks.title}
        >
        </CardTasks>
        );
    });
    return (
      <div className="cardList">
        { taskNodes }
      </div>
    );
  }
});


const CardTasks = React.createClass({
  render: function(){
    return (
      <div className="cardTasks">
        {this.props.title}
      </div>
    );
  }
});

ReactDOM.render(
  <MainBoard url="/api/tasks" />,
  document.getElementById('app')
);