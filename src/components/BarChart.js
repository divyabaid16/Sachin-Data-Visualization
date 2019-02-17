import React, {Component} from 'react';
import * as d3 from 'd3';
import {legend} from 'd3-svg-legend'
class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = this.props.data;
        const h=this.props.height;
        const w=this.props.width;
        const date=this.props.date;
        const result=this.props.result;
        const margin=50;

        let dataset=[];
        for(var i=0;i<data.length;i++){
            dataset.push([data[i],date[i],result[i]]);
        }

        //Defining X-Scale
        const xScale = d3.scaleTime()
            .domain(d3.extent(dataset, function(d) { return d[1]; }))
            .range([0, w - 0]);

        //Defining Y-Scale
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d[0]; })])
            .range([h, 0]);

        const svg = d3.select(".svg").append("svg")
            .attr("width", w+3*margin)
            .attr("height", h+3*margin)
            .append("g")
            .attr("transform", "translate(" + 2*margin + "," + margin + ")");

        //Creating bars
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(d[1]))
            .attr("y", (d, i) => yScale(d[0]))
            .attr("width",2 )
            .attr("height", (d, i) =>h-yScale(d[0]))
            .attr("data-legend",function(d) { return d[2]})
            .attr("fill", (d,i)=>{
                if(d[2]=="won")
                    return "blue"
                 else
                     return "red"
            });


        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", "translate(0," + (h ) + ")")
            .style("font-size","15")
            .call(xAxis);

        //Adding label to X-axis
        svg.append("text")
            .attr("transform", "translate(" + (w/2) + " ," + (h +margin+10) + ")")
            .style("text-anchor", "middle")
            .attr("font-size","20")
            .text("Year");

        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class","font-axis")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("font-size","20")
            .attr("y", 0 - margin-30)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Runs scored");


        //Defining tooltip
        svg.selectAll("rect")
            .append("title")
            .text((data) => data);

        var colors=["blue","red"];

        var legends=svg.append("g")
            .selectAll(".legends").data(["won","lost"]);
        var legend=legends.enter().append("g").classed("legends",true).attr("transform",function (d,i) {return "translate(100,"+(i+1)*30+")";});
        legend.append("rect").attr("width",20).attr("height",20).attr("fill",function (d,i) {return colors[i]});

        legend.append("text").text(function (d) {return d})
            .attr("fill",function (d,i) {return colors[i]})
            .attr("x",30)
            .attr("y",20);



    }

    render(){
        //return <div id={"#" + this.props.id}></div>
        return(

            <div className="container-fluid">
                <div className="svg heading">
                    <h1>{this.props.title}</h1>
                </div>
                <div >

                    <p>{this.props.para}</p>
                </div>
            </div>
        )
    }
}

export default BarChart;
