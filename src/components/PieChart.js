import React, {Component} from 'react';
import * as d3 from "d3";
import '../App.css';

const text=`
    font-size:15px;
    font-weight:bold;
    fill:white;
`;

export default class PieChart extends Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {

        d3.select("body").append("h1").text(this.props.title).attr("class","heading");

        const raw_data = this.props.data;
        const d=["score between 0 - 50","score between 50 - 100","score between 100 - 150","score greater than 150"];
        const h=this.props.height;
        const w=this.props.width;
        const margin = 50;
        var db=[];
        for(var i=0;i<d.length;i++){
            db.push([raw_data[i],d[i]]);
        }

        var colors=d3.scaleOrdinal(d3.schemeDark2);
        var data = d3.pie().value(function(d) { return d[0] ;})(db);
        console.log(data);

        var svg=d3.select("body").append("svg")
            .attr("width",w)
            .attr("height",h+2*margin);

        var segments=d3.arc()
            .innerRadius(0)
            .outerRadius(200)
            .padAngle(.05)
            .padRadius(50);

        var sections=svg.append("g").attr("transform","translate(250,250)")
            .selectAll("path").data(data);

        sections.enter().append("path").attr("d",segments).attr("fill",function (d) {return colors(d.data[0])});

        var content=svg.select("g").selectAll("text").data(data);
        content.enter().append("text").each(function (d) {
            console.log("1");
            var center = segments.centroid(d);
            d3.select(this).attr("x", center[0]).attr("y", center[1])
                .text(d.data[0]);
        }).attr("class","pie");

        var legends=svg.append("g").attr("transform","translate(500,100)")
            .selectAll(".legends").data(data);
        var legend=legends.enter().append("g").classed("legends",true).attr("transform",function (d,i) {return "translate(100,"+(i+1)*30+")";});
        legend.append("rect").attr("width",20).attr("height",20).attr("fill",function (d) {return colors(d.data[0])});

        legend.append("text").text(function (d) {return d.data[1]})
            .attr("fill",function (d) {return colors(d.data[0])})
            .attr("x",30)
            .attr("y",20);

        d3.select("body").append("p").text(this.props.para);

    }

    render() {
        return (
            <div></div>
        );
    }
}
