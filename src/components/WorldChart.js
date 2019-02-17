import React, {Component} from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"


export default class WorldChart extends Component {


    componentDidMount() {
        d3.select("body").append("h1").text("Bar Graph");

        var svg = d3.select("body").append("svg");
        var path = d3.geoPath().projection(d3.geoMercator());
        d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
            if (error) throw error;
            svg.selectAll("path")
                .data(feature(world,world.objects.countries).features)
                .enter().append("path")
                .attr("d", path);

        });
    }
    render() {
        return (
            <div></div>
        );
    }
}
