import {BarChart} from 'react-easy-chart'
import {LineChart} from 'react-easy-chart'
import React, {Component} from 'react'
import axios from 'axios'


export default class Charts extends Component {

   constructor() {
     super();
     this.renderBarChart = this.renderBarChart.bind(this)
     this.setChart = this.setChart.bind(this)
     this.state = {
       //it really doesn't matter what you put in here
       width: 1500,
       height: 700,
       data: [{ x: 'A',y: 46 }, { x: 'B', y: 26 }],
       chart: '',
       bar_data: null,
       line_data: null,
     }
   }

   componentDidMount(){
       /* On mount, get the user_id, and current open tasks */
       // Get user_id from API
       this.getBarData().then(
           data => {
               console.log(data)
               this.setState({bar_data: data})
       })
       this.getLineData().then(
           data => {
               this.setState({line_data: data})
       })

   }

   getBarData() {
       /* Gets open task and retrieves list of open tasks */
       var packet = {user_id: this.props.user_id}
       console.log(packet)
       var promise = axios.post('http://localhost:5000/get_bar_data', {
           user_id: this.props.user_id,
       }).then(function(response) {
            return response.data;
       })
       return promise
   }

   getLineData() {
       /* Gets open task and retrieves list of open tasks */
       var promise = axios.post('http://localhost:5000/get_line_data', {
           user_id: this.props.user_id,
       }).then(function(response) {
            return response.data;
       })
       return promise
   }

   renderBarChart() {
      return (
            <BarChart
                 axisLabels={{x: 'Task', y: 'Seconds spent'}}
                 axes={this.state.width}
                 colorBars
                 grid
                 width={this.state.width}
                 height={this.state.height}
                 data={this.state.bar_data}
             />
      )
   }

   renderLineChart() {
      console.log(this.state.line_data)

      return (
         <LineChart
            xType={'time'}
            datePattern={'%Y-%m-%d %H:%M:%S'}
            axisLabels={{x: 'Time', y: 'Seconds spent'}}
            axes={this.state.width}
            width={this.state.width}
            height={this.state.height}
            data={this.state.line_data}
          />
        )
   }

   setChart(e){
       this.setState({chart: e.target.id})
       console.log(this.state.chart)
   }


    render() {
      return (
          <div className="container-flex">
              <div className="row">
                  <div className="col-1">
                      <button className="btn btn-outline-secondary mt-2 mr-4" onClick={this.setChart} id="bar">BAR</button>
                      <button className="btn btn-outline-secondary mt-2 mr-4" onClick={this.setChart} id="line">LINE</button>
                  </div>
                  <div className="col-11">
                    {this.state.chart === 'bar' ? this.renderBarChart() : null }
                    {this.state.chart === 'line' ? this.renderLineChart() : null }
                  </div>
              </div>
          </div>
      )
    }
};
