import Charts from './charts'
import Tasks from './tasks'
import React, {Component} from 'react'
import axios from 'axios'
import './main.css'

export default class App extends Component {
    constructor() {
      super();
      // Class functions
      this.renderBanner = this.renderBanner.bind(this)

      // The url for our api
      this.api_url = 'http://localhost:5000'

      // Hard coded user
      this.user = 'robert manteghi'

      this.state = {
         page: "tasks"
      }
    }

    componentDidMount(){
       /* On mount, get the user_id, and current open tasks */
       // Get user_id from API
       this.postUser(this.user).then(
           data => {
               this.setState({user_id: data.user_id})
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


    setPage = (e) => {
       e.persist()
       this.setState(function (prevState, props) {
         return {
            page: e.target.id
         }
       })
    }

    renderBanner() {
      return(
         <div className="container-flex">
             <div className="row pb-5 justify-content-between">
                 <h1 className="col-10 title">WorkTracker</h1>
                 <div className="col-2 btn-toolbar">
                     <button className="btn btn-outline-secondary mr-3 d-flex align-items-center"
                             onClick={this.setPage} id="tasks">
                         <i id="tasks" className="material-icons">home</i>
                     </button>
                     <button className="btn btn-outline-secondary mr-3 d-flex align-items-center"
                             onClick={this.setPage} id="charts">
                         <i id="charts" className="material-icons">bar_chart</i>
                     </button>
                 </div>
             </div>
        </div>
      )
    }

    render() {
     return (
        <div className="container-flex pt-5 pl-5 pr-5">
              {this.renderBanner()}
              {this.state.page === "charts" ? <Charts api_url={this.api_url} user_id={this.state.user_id}/> : null}
              {this.state.page === "tasks" ? <Tasks api_url={this.api_url} user_id={this.state.user_id}/> : null}
        </div>
      )
    }
};
