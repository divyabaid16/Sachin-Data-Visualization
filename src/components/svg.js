import React, {Component} from 'react';
import * as d3 from 'd3';

export default class svg extends Component {
    render() {
        const svg = d3.select(".svg").append("svg")
            .attr("width", 1100+3*50)
            .attr("height", 400+3*50)
            .append("g")
            .attr("transform", "translate(" + 2*50 + "," + 50 + ")");

        return (
            <div className="svg"></div>
        );
    }
}
