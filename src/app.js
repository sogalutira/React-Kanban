const TaskForm = React.createClass({
  getInitialState: function() {
      return {
        title: '',
        priority: 3,
        createdBy: '',
        assignedTo: '',
        status: 'Queue'
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
    if (!title || !priority || !createdBy || !status){
      return;
    }
    this.props.onTaskSubmit({
      title: title,
      priority: priority,
      createdBy: createdBy,
      assignedTo: assignedTo,
      status: status});
    this.setState({
      title: '',
      priority: 3,
      createdBy: '',
      assignedTo: '',
      status: 'Queue'});
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
              <option ref='Low' value="1">Low</option>
              <option ref='Medium' value="2">Medium</option>
              <option ref='High' value="3">High</option>
              <option ref='Important!' value="4">Important!</option>
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
        data.sort(function(a,b){
          if(a.priority < b.priority){
            return 1;
          }else if (a.priority > b.priority){
            return -1;
          }else{
            return 0;
          }
        })
        this.setState({
          data: data
        });
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
        <div className="titleHeader">
          <h1>React Kanban</h1>
        </div>
        <div className="statusContainer">
          <div className="queueDiv">
            <h2>Queue</h2>
              <CardList
                data={this.state.data}
                status = 'Queue'
              />
          </div>
          <div className="inProgressDiv">
            <h2>In Progress </h2>
              <CardList
                data={this.state.data}
                status = 'In Progress'
              />
          </div>
          <div className="doneDiv">
            <h2>Done</h2>
              <CardList
                data={this.state.data}
                status = 'Done'
              />
          </div>
        </div>
        <TaskForm onTaskSubmit={this.handleTaskSubmit} />
      </div>
    );
  }
});

const CardList = React.createClass({
  filterStatus: function(filter, data){
    return data.filter(function(status){
      return status.status === filter;
    })
  },


  render: function(){
    const taskNodes = this.filterStatus(this.props.status, this.props.data)
      .map(function(tasks, index){
        return(
          <CardTasks
            key={index}
            title={tasks.title}
            priority= {tasks.priority}
            createdBy={tasks.createdBy}
            assignedTo={tasks.assignedTo}
            status={tasks.status}
            id={tasks.id}
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
  handleDelete: function(e){
    e.preventDefault();
    console.log('after preventDefault:', this.props);
    $.ajax({
      url: `/api/tasks/${this.props.id}`,
      dataType: 'json',
      type: 'DELETE',
      success: function(){
        console.log('delete handle');
      }.bind(this)
    });
  },

  render: function(){
    return (
      <div className="cardTasks">
        <div className="cardText">
          {`${this.props.title} `}
          <br/>
          {`Priority: ${this.props.priority} `}
          <br/>
          {`Created by: ${this.props.createdBy} `}
          <br/>
          {`Assigned to: ${this.props.assignedTo} `}
          <div>
            <form className="deleteForm" onSubmit={this.handleDelete}>
              <input type="submit" value="Delete" />
            </form>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <MainBoard url="/api/tasks" />,
  document.getElementById('app')
);