const TaskForm = React.createClass({
  getInitialState: function() {
      return {
        title: '',
        priority: 3,
        createdBy: '',
        assignedTo: '',
        status: ''
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

  handleStatusChange: function(e){
    this.setState({status: e.target.value})
  },

  handleSubmit: function(e){
    e.preventDefault();
    let title = this.state.title.trim();
    let priority = this.state.priority;
    let createdBy = this.state.createdBy.trim();
    let assignedTo = this.state.assignedTo.trim();
    let status = this.state.status;
    if (!title || !priority || !createdBy || !assignedTo || !status){
      return;
    }
    this.props.onCommentSubmit({title: title, priority: priority, createdBy: createdBy, assignedTo: assignedTo, status: status});
    this.setState({title: '', priority: 3, createdBy: '', assignedTo: '', status: ''});
  },

  render: function(){
    return (
      <form className="taskForm" onSubmit={this.handleSubmit}>
        <label>
          Title
          <input type="text" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
        </label>
        <p>
          <label>
            Priority
            <select value={this.state.priority} onChange={this.handlePriorityChange}>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
              <option value="4">Important!</option>
            </select>
          </label>
        </p>
        <p>
          <label>
            Created By:
            <input type="text" placeholder="Created By (full name)" value={this.state.createdBy} onChange={this.handleCreatedByChange} />
          </label>
        </p>
        <p>
          <label>
            Assigned To:
            <input type="text" placeholder="Assigned To (full name)" value={this.state.assignedTo} onChange={this.handleAssignedToChange} />
          </label>
        </p>
        <p>
          <label>
            Status:
            <select value={this.state.status} onChange={this.handleStatusChange}>
              <option value="Queue">Queue</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>
        </p>
        <p>
          <input type="submit" value="Post" />
        </p>
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

  filterStatus: function(filter, data){
    return data.filter(function(status){
      return status.status === filter;
    })
  },

  render: function(){
    return (
      <div className="mainBoard">
        <div>
          <h1>React Kanban</h1>
        </div>
        <div className="queueDiv">
          <h2>Queue</h2>
            <CardList data={this.filterStatus('Queue', this.state.data)}/>
        </div>
        <div className="inProgressDiv">
          <h2>In Progress </h2>
            <CardList data={this.filterStatus('In Progress', this.state.data)}/>
        </div>
        <div className="done">
          <h2>Done</h2>
            <CardList data={this.filterStatus('Done', this.state.data)}/>
        </div>
        <TaskForm onCommentSubmit={this.handleTaskSubmit} />
      </div>
    );
  }
});

const CardList = React.createClass({
  render: function(){
    const taskNodes = this.props.data.map(function(tasks, index){
      return(
        <CardTasks
          key={index}
          title={tasks.title}
          priority={tasks.priority}
          createdBy={tasks.createdBy}
          assignedTo={tasks.assignedTo}
          status={tasks.status}
        >
        </CardTasks>
        );
    })
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
        {`${this.props.title} `}
        {`${this.props.priority} `}
        {`${this.props.createdBy} `}
        {`${this.props.assignedTo} `}

      </div>
    );
  }
});

ReactDOM.render(
  <MainBoard url="/api/tasks" />,
  document.getElementById('app')
);