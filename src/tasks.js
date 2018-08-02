import React, {Component} from 'react'
import axios from 'axios'

export default class Tasks extends Component {

   constructor() {
     super();
     // testvalue
     this.user = 'robert manteghi'
     // Class functions
     this.addTask = this.addTask.bind(this);
     this.changeTaskInput = this.changeTaskInput.bind(this);
     this.changeCurrentTask = this.changeCurrentTask.bind(this);

     this.state = {
         // List of users open tasks
         open_tasks: [],
         input_task: "",
         current_task: "Break",
         // testvalue
         user_id: 0
     }

   }

   componentDidMount(){
       /* On mount, get the user_id, and current open tasks */
       // Get user_id from API
       this.postUser(this.user).then(
           data => {
               this.setState({user_id: data.user_id})
               // Get open tasks from API
               this.getOpenTasks(data.user_id).then(
                   data => {
                       this.setState({open_tasks: data})
               })
       })

   }

    postUser (user) {
       // Posts user and retrieves new/existing user_id
       var promise = axios.post('http://localhost:5000/add_user', {
           user_name: user,
       }).then(function(response) {
            return response.data;
       })
       return promise
   }

   postTask (task) {
       /* Posts task and retrieves new/existing task_id */
       var promise = axios.post('http://localhost:5000/add_task', {
           task: task
       }).then(function(response) {
            return response.data;
       })
       return promise
   }

   postAddOpenTask (user_id, task_id) {
       /* Posts new open task */
       axios.post('http://localhost:5000/add_current_task', {
           user_id: user_id,
           task_id: task_id,
        }).then((response) => {console.log(response.data)})
   }

   PostDeleteOpenTask (user_id, task_id) {
       /* Posts delete for open task */
       axios.post('http://localhost:5000/delete_current_task', {
           user_id: user_id,
           task_id: task_id,
        }).then((response) => {console.log(response.data)})
   }

   getOpenTasks() {
       /* Gets open task and retrieves list of open tasks */
       var promise = axios.post('http://localhost:5000/get_current_tasks', {
           user_id: this.state.user_id,
       }).then(function(response) {
            return response.data;
       })
       return promise
   }

   postLogTask (task_id, user_id) {
       /* Logs a change in task */
       axios.post('http://localhost:5000/log_task', {
           user_id: user_id,
           task_id: task_id,
        }).then((response) => {console.log(response.data)})
   }

   addTask () {
     /*
        Gets the value from the Input bar.
        Adds value to the list of open_tasks.
        Posts new task to API
     */
     // Disable button to prevent multiple click */
     this.refs.btn.setAttribute("disabled", "disabled");
     // If the value is not an existing task or empty //
     if (!this.state.open_tasks.map(e => e.task).includes(this.state.input_Task) && this.state.input_Task!=="") {
         // Post task to API
         this.postTask(this.state.input_task).then(
             data => {
                 // Retrieve new/existing task_id
                 var task = {'task_id': data.task_id, 'task': this.state.input_task}
                 // Add task and task_id to the list of open_tasks
                 this.setState(prevState => ({ open_tasks: [...prevState.open_tasks, task]}))
                 // Post open task to API
                 this.postAddOpenTask(this.state.user_id, data.task_id)
         });
     }
     this.refs.btn.removeAttribute("disabled")
   }

   deleteTask(task_id,  task){
     /*
        Remove task from the list of open_tasks.
        Posts deleted task to API
     */

     // Copy list of open_tasks
      var array = [...this.state.open_tasks]
      // Find the index in list of open_tasks for deleted task
      const index = array.map(e => e.task_id).indexOf(task_id);
      // Delete task
      array.splice(index, 1)
      // Set state for new list open_tasks
      this.setState({open_tasks: array})
      // Posted deleted open task to API
      this.PostDeleteOpenTask(this.state.user_id, task_id)
   }

   changeCurrentTask(e){
       /* Sets task_id, of event, as current task*/
       this.setState({current_task: e.target.value})
       this.postLogTask(e.target.id, this.state.user_id)
   }

   changeTaskInput(e){
      /* Updates task in Input bat */
      this.setState({input_task : e.target.value})
   }

   renderRadioButton = (id, value) => {
      /* Renders a radio button */
      return (
           <div className="row">
               <div className="col-9 form-check">
                   <input className="form-check-input" type="radio" value={value} id={id} checked={this.state.current_task === value}
                          onChange={this.changeCurrentTask}/>
                   <label className=" d-block form-check-label text-truncate" htmlFor={id}>
                    {value}
                   </label>
               </div>
               <button className="btn btn-outline-secondary button-icon d-flex align-items-center"
                       type='button'  id={id} value={value} onClick={this.deleteTask.bind(this, id, value)}>
                   <i id={id} value={value} className="material-icons">remove</i>
               </button>
           </div>
      )
   }


    render() {
      return (
          <div className="container-flex">
              <div className="container-flex pb-5">
                  <div className="row">
                      <div className="col-12 input-group">
                          <input className="col-5 d-block form-control" type="text" onChange={this.changeTaskInput} placeholder="Submit a task"/>
                          <span className="input-group-btn pl-2">
                              <button onClick={this.addTask} ref="btn" className="btn btn-outline-secondary button-icon d-flex align-items-center">
                                  <i className="material-icons">add</i>
                              </button>
                          </span>
                      </div>
                  </div>
              </div>
              <div className="container-flex pl-5">
                  <div className="row">
                      <div className="col-4">
                           <div className="row pb-3">
                               <div className="form-check col-9">
                                   <input className="form-check-input" type="radio" id="0" value="Break" onChange={this.changeCurrentTask} checked={this.state.current_task === "Break"}/>
                                   <label className="form-check-label" htmlFor="0">
                                    Break
                                   </label>
                               </div>
                           </div>
                           { this.state.open_tasks.map(e => this.renderRadioButton(e.task_id, e.task) )}
                      </div>
                  </div>
              </div>
          </div>
      )
    }
};
