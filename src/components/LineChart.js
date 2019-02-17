import React, {Component} from 'react';
import * as d3 from 'd3';
import '../App.css';

export default class LineChart extends Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart(){
        const data = this.props.data;
        const h=this.props.height;
        const w=this.props.width;
        const margin=50;
        var yLabel=this.props.text;
        
        var dataset=[];

        for(let i of data.keys()){
            dataset.push([[data.get(i)],[i]]);
        }
        //used for styling
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("opacity", 0);

        //Add Heading
        d3.select("body").append("h1").text(this.props.title).attr("class","heading");

        //Add svg element
        const svg = d3.select("body").append("svg")
            .attr("width", w+3*margin)
            .attr("height", h+3*margin)
            .append("g")
            .attr("transform", "translate(" + 2*margin + "," + margin + ")");

        //Define the scale
        var x = d3.scaleTime().range([0, w]);
        var y = d3.scaleLinear().range([h, 0]);

        //Get values for the line
        var valueline = d3.line()
            .x(function(d) { return x(d[1]) })
            .y(function(d) { return y(d[0]) });

        //Domain of the Axis
        x.domain(d3.extent(dataset, function(d) { return d[1]; }));
        y.domain([0, d3.max(dataset, function(d) { return d[0]*1; })]);

        //Create the path
        svg.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", valueline);

        //Create circles (data points)
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => x(d[1]))
            .attr("cy", (d, i) => y(d[0]))
            .attr("r", 6)
            .attr("data-legend",function(d) { return d[2]})
            .attr("fill", this.props.color)
            .on("mouseover", function(d) {
                div.style("opacity", .9);
                div.attr("data-year", d.Year)
                div.html("Year : "+ d[1] + "<br/>"
                    + yLabel +" : "+d[0])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.style("opacity", 0);
            });

        var formatxAxis = d3.format('.0f');

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .attr("class","font-axis")
            .call(d3.axisBottom(x).tickFormat(formatxAxis)
                .ticks(10));

        //X Label
        svg.append("text")
            .attr("transform",
                "translate(" + (w/2) + " ," +
                (h +margin+10) + ")")
            .style("text-anchor", "middle")
            .attr("font-size","20")
            .text("Year");

        // Add the Y Axis
        svg.append("g")
            .attr("class","font-axis")
            .call(d3.axisLeft(y));

        //Y Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("font-size","20")
            .attr("y", 0 - margin-30)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(this.props.text);

        //Add description
        d3.select("body").append("p").text(this.props.para);

    }
    render() {
        return (
            <div className="container svg">
                <div className="heading">

                </div>
                <div>

                </div>
            </div>
        );
    }
}
