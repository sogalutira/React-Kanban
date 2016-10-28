'use strict';

var TaskForm = React.createClass({
  displayName: 'TaskForm',

  getInitialState: function getInitialState() {
    return {
      title: '',
      priority: 3,
      createdBy: '',
      assignedTo: '',
      status: 'Queue'
    };
  },

  handleTitleChange: function handleTitleChange(e) {
    this.setState({ title: e.target.value });
  },

  handlePriorityChange: function handlePriorityChange(e) {
    this.setState({ priority: e.target.value });
  },

  handleCreatedByChange: function handleCreatedByChange(e) {
    this.setState({ createdBy: e.target.value });
  },

  handleAssignedToChange: function handleAssignedToChange(e) {
    this.setState({ assignedTo: e.target.value });
  },

  handleStatusChange: function handleStatusChange(e) {
    this.setState({ status: e.target.value });
  },

  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var priority = this.state.priority;
    var createdBy = this.state.createdBy.trim();
    var assignedTo = this.state.assignedTo.trim();
    var status = this.state.status;
    // if (!title || !priority || !createdBy || !status){
    //   return;
    // }
    if (!title) {
      title = 'Lazy';
    }
    if (!priority) {
      priority = 3;
    }
    if (!createdBy) {
      createdBy = 'You';
    }
    if (!assignedTo) {
      assignedTo = 'You';
    }
    if (!status) {
      status = 'In Progress';
    }
    this.props.onTaskSubmit({
      title: title,
      priority: priority,
      createdBy: createdBy,
      assignedTo: assignedTo,
      status: status });
    this.setState({
      title: '',
      priority: 3,
      createdBy: '',
      assignedTo: '',
      status: 'Queue' });
  },

  render: function render() {
    return React.createElement(
      'form',
      { className: 'taskForm', onSubmit: this.handleSubmit },
      React.createElement(
        'label',
        null,
        'Title',
        React.createElement('input', { type: 'text', placeholder: 'Title', value: this.state.title, onChange: this.handleTitleChange })
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'label',
          null,
          'Priority',
          React.createElement(
            'select',
            { value: this.state.priority, onChange: this.handlePriorityChange },
            React.createElement(
              'option',
              { ref: 'Low', value: '1' },
              'Low'
            ),
            React.createElement(
              'option',
              { ref: 'Medium', value: '2' },
              'Medium'
            ),
            React.createElement(
              'option',
              { ref: 'High', value: '3' },
              'High'
            ),
            React.createElement(
              'option',
              { ref: 'Important!', value: '4' },
              'Important!'
            )
          )
        )
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'label',
          null,
          'Created By:',
          React.createElement('input', { type: 'text', placeholder: 'Created By (full name)', value: this.state.createdBy, onChange: this.handleCreatedByChange })
        )
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'label',
          null,
          'Assigned To:',
          React.createElement('input', { type: 'text', placeholder: 'Assigned To (full name)', value: this.state.assignedTo, onChange: this.handleAssignedToChange })
        )
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'label',
          null,
          'Status:',
          React.createElement(
            'select',
            { value: this.state.status, onChange: this.handleStatusChange },
            React.createElement(
              'option',
              { value: 'Queue' },
              'Queue'
            ),
            React.createElement(
              'option',
              { value: 'In Progress' },
              'In Progress'
            ),
            React.createElement(
              'option',
              { value: 'Done' },
              'Done'
            )
          )
        )
      ),
      React.createElement(
        'p',
        null,
        React.createElement('input', { type: 'submit', value: 'Post' })
      )
    );
  }
});

var MainBoard = React.createClass({
  displayName: 'MainBoard',

  loadMainBoard: function loadMainBoard() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        data.sort(function (a, b) {
          if (a.priority < b.priority) {
            return 1;
          } else if (a.priority > b.priority) {
            return -1;
          } else {
            return 0;
          }
        });
        this.setState({
          data: data
        });
      }.bind(this)
    });
  },

  handleTaskSubmit: function handleTaskSubmit(tasks) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: tasks,
      success: function () {
        this.loadMainBoard();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function getInitialState() {
    return { data: [] };
  },

  componentDidMount: function componentDidMount() {
    this.loadMainBoard();
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'mainBoard' },
      React.createElement(
        'div',
        { className: 'titleHeader' },
        React.createElement(
          'h1',
          null,
          'React Kanban'
        )
      ),
      React.createElement(
        'div',
        { className: 'statusContainer' },
        React.createElement(
          'div',
          { className: 'queueDiv' },
          React.createElement(
            'h2',
            null,
            'Queue'
          ),
          React.createElement(CardList, {
            data: this.state.data,
            status: 'Queue',
            loadMainBoard: this.loadMainBoard
          })
        ),
        React.createElement(
          'div',
          { className: 'inProgressDiv' },
          React.createElement(
            'h2',
            null,
            'In Progress '
          ),
          React.createElement(CardList, {
            data: this.state.data,
            status: 'In Progress',
            loadMainBoard: this.loadMainBoard
          })
        ),
        React.createElement(
          'div',
          { className: 'doneDiv' },
          React.createElement(
            'h2',
            null,
            'Done'
          ),
          React.createElement(CardList, {
            data: this.state.data,
            status: 'Done',
            loadMainBoard: this.loadMainBoard
          })
        )
      ),
      React.createElement(TaskForm, { onTaskSubmit: this.handleTaskSubmit })
    );
  }
});

var CardList = React.createClass({
  displayName: 'CardList',

  filterStatus: function filterStatus(filter, data) {
    return data.filter(function (status) {
      return status.status === filter;
    });
  },

  render: function render() {
    var loadMainBoard = this.props.loadMainBoard;
    var taskNodes = this.filterStatus(this.props.status, this.props.data).map(function (tasks, index) {
      return React.createElement(CardTasks, {

        loadMainBoard: loadMainBoard,
        key: index,
        title: tasks.title,
        priority: tasks.priority,
        createdBy: tasks.createdBy,
        assignedTo: tasks.assignedTo,
        status: tasks.status,
        id: tasks.id
      });
    });
    return React.createElement(
      'div',
      { className: 'cardList' },
      taskNodes
    );
  }
});

var CardTasks = React.createClass({
  displayName: 'CardTasks',

  handleDelete: function handleDelete(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/tasks/' + this.props.id,
      dataType: 'json',
      type: 'DELETE',
      success: function () {
        this.props.loadMainBoard();
      }.bind(this)
    });
  },

  handleEdit: function handleEdit(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/tasks/' + this.props.id,
      dataType: 'json',
      type: 'PUT',
      data: this.props.status,
      success: function (result) {
        console.log('handleEdit');
        console.log('results: ', result);
        if (result.status === "Queue") {
          result.status = "In Progress";
        } else {
          if (result.status === "In Progress") {
            result.status = "Done";
          }
          return result.status;
        }
        this.props.loadMainBoard();
      }.bind(this)
    });
  },

  render: function render() {

    return React.createElement(
      'div',
      { className: 'cardTasks' },
      React.createElement(
        'div',
        { className: 'cardText' },
        this.props.title + ' ',
        React.createElement('br', null),
        'Priority: ' + this.props.priority + ' ',
        React.createElement('br', null),
        'Created by: ' + this.props.createdBy + ' ',
        React.createElement('br', null),
        'Assigned to: ' + this.props.assignedTo + ' ',
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { onClick: this.handleEdit },
            ' >'
          ),
          React.createElement(
            'form',
            { className: 'deleteForm', onSubmit: this.handleDelete },
            React.createElement('input', { type: 'submit', value: 'Delete' })
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MainBoard, { url: '/api/tasks' }), document.getElementById('app'));