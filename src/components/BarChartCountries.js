import React, {Component} from 'react';
import * as d3 from 'd3';
class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = this.props.data;
        const h=this.props.height;
        const w=this.props.width;
        const margin=50;
        let countries=[];
        let runs=[];
        let dataset=[];
        for(let i of data.keys()){
            dataset.push([[data.get(i)*1],[i]]);
            countries.push(i);
            runs.push([data.get(i)])
        }

        var max=Math.max(...runs);
        var min=Math.min(...runs);

        console.log(max,min);
        console.log(dataset[0]);

        console.log(countries);
        d3.select(".area").append("h1").text(this.props.title).attr("class","heading");

        const xScale = d3.scalePoint()
            .domain(countries)
            .range([20,w-40]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d[0]*1; })])
            .range([h, 0]);

        const svg = d3.select(".area").append("svg")
            .attr("width", w+2*margin)
            .attr("height", h+3*margin)
            .append("g")
            .attr("transform", "translate(" + 2*margin + "," + margin + ")");


        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i*60))
            .attr("y", (d, i) => yScale(d[0]))
            .attr("width",(d,i)=>40 )
            .attr("height", (d, i) =>h-yScale(d[0]))
            .attr("fill", function (d,i) {
                if(d[0]==max)
                    return "red"
                else if(d[0]==min)
                    return "yellow"
                else
                    return "HotPink"
            });

        svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text((d,i) => d[0])
            .attr("x", (d, i) => i * 60)
            .attr("y", (d, i) => yScale(d[0])-3);

        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", "translate(0," + (h ) + ")")
            .attr("class","font-axis")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");


        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class","font-axis")
            .call(yAxis);

        /*svg.append("text")
            .attr("transform",
                "translate(" + (w/1.1) + " ," +
                (h -margin+10) + ")")
            .style("text-anchor", "middle")
            .attr("font-size","20")
            .text("Countries");
            */

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("font-size","20")
            .attr("y", 0 - margin-30)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Runs Scored");

        svg.selectAll("rect")
            .append("title")
            .text((data) => data);
        d3.select(".area").append("p").text(this.props.para);
    }

    render(){
        return(
            <div className="container-fluid area"></div>
        )
    }
}

export default BarChart;
