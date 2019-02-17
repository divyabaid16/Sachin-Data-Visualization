import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import data from './sachin.csv';
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import {csv} from 'd3-request'
import * as d3 from 'd3';
import WorldChart from "./components/WorldChart";
import BarChartCountries from "./components/BarChartCountries";
import PieChart from "./components/PieChart"
import {external} from "./data";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 900,
            height: 400
        };
    }

    componentWillMount() {
        csv(data, (error, data) => {
            if (error) {
                this.setState({loadError: true});
            }

            let batting_score=[],
                opposition=[],
                ground=[],
                date=[],
                match_result=[];

            //Formatting date
            var parseTime = d3.timeParse("%d %b %Y");

            //Storing the required value in array for passing as props
            data.forEach(function(d) {
                if(isNaN(d['batting_score']))
                    batting_score.push(0);
                else
                    batting_score.push(d['batting_score']*1);
                date.push(parseTime(d.date));
                opposition.push(d['opposition']);
                match_result.push(d['match_result']);
                ground.push(d['ground']);
            });

            //Creating maps to store key pair values
            let map_match=new Map();
            let map_sum=new Map();
            let map_avg=new Map();

            //Mapping Year with total number of runs scored and total number of matches played that year
            var sum=function(){
                var j=0;
                for(var i=0;i<data.length;i++){
                    var year=date[i].getFullYear();
                    if(map_match.has(year)){
                        j++;
                        map_match.set(year,j);
                        map_sum.set(year,map_sum.get(year)+batting_score[i]);
                    }
                    else{
                        map_match.set(year,1);
                        map_sum.set(year,batting_score[i]);
                        j=0;
                    }
                }
            };

            sum();
            //Mapping Year with average runs played
            var average=function () {
                var avg;
                for(let i of map_match.keys()){
                    avg=map_sum.get(i)/map_match.get(i);
                    map_avg.set(i,avg.toFixed(2));
                }
            };
            average();

            let map_country_total=new Map();
            let map_country_result_won=new Map();

            //Calculate total runs scored against each country
            var countryScore=function () {
                var j=0;
                for(var i=0;i<data.length;i++){

                    if(map_country_total.has(opposition[i])){
                        map_country_total.set(opposition[i],map_country_total.get(opposition[i])+batting_score[i]);
                                            }
                    else{
                        map_country_total.set(opposition[i],+batting_score[i]);
                    }
                }
            };
            countryScore();
            //Calculate Range wise batting score
            var range=[0,0,0,0];
            for(var i=0;i<data.length;i++){
                if(batting_score[i]>=150)
                    range[3]++;
                else {
                    if (batting_score[i] >= 100)
                        range[2]++;
                    else {
                        if (batting_score[i] >= 50)
                            range[1]++;
                        else if (batting_score[i] >= 0)
                            range[0]++;
                    }
                }
            }

            //Updating the state
            this.setState({
                data1:batting_score,
                date:date,
                sum:map_sum,
                avg:map_avg,
                matches:map_match,
                country: map_country_total,
                range:range,
                result:match_result
            });

        })
    }
    color=["DarkOrange","Indigo","green"];

    render()
    {
        if (this.state.loadError) {
            return <div>couldn't load file</div>;
        }
        if (!this.state.data1) {
            return <div />;
        }
        return (
            <div className="App">
                <div className="container">
                    <React.Fragment>
                    <BarChart data={this.state.data1} width={this.state.width} height={this.state.height} date={this.state.date} result={this.state.result} para={external[0].data} title={external[0].title}/>
                    <LineChart data={this.state.sum} width={this.state.width} height={this.state.height} text={"Total runs"} para={external[1].data} title={external[1].title} color={this.color[0]}/>
                    <LineChart data={this.state.matches} width={this.state.width} height={this.state.height} text={"Number of matches"} para={external[3].data} title={external[3].title} color={this.color[2]}/>
                        <LineChart data={this.state.avg} width={this.state.width} height={this.state.height} text={"Average runs"} para={external[2].data} title={external[2].title} color={this.color[1]}/>
                    <BarChartCountries data={this.state.country} width={this.state.width} height={this.state.height} para={external[4].data} title={external[4].title}/>
                    <PieChart data={this.state.range} width={this.state.width} height={this.state.height} para={external[5].data} title={external[5].title}/>
                    </React.Fragment>
                </div>
            </div>
        );
    }
}
export default App;