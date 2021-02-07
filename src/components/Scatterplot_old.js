import React, {useEffect, useRef} from "react";
import { scaleLinear, max, axisLeft, axisBottom, select } from "d3";
import PropTypes from 'prop-types';

export default function SP(props){
    const margin = { top: 20, right: 15, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const data = props.data;
    const x = scaleLinear()
      .domain([
        0,
        max(data, d => d[0].value)
      ])
      .range([0, width])

    const y = scaleLinear()
      .domain([
        0,
        max(data, d => d[0].value)
      ])
      .range([height, 0])

    return (
      <div>
        <h3> Scatter Plot with Trend Line </h3>
        <svg
          width={width + margin.right + margin.left}
          height={height + margin.top + margin.bottom}
          className="chart"
        >
              <g
                transform={"translate(" + margin.left + "," + margin.top + ")"}
                width={width}
                height={height}
                className="main"
              >
                <RenderCircles data={data} scale={{ x, y }} />
                {/*<TrendLine data={data} scale={{ x, y }} />*/}
                <Axis
                  axis="x"
                  transform={"translate(0," + height + ")"}
                  scale={axisBottom().scale(x)}
                />
                <Axis
                  axis="y"
                  transform="translate(0,0)"
                  scale={axisLeft().scale(y)}
                />
              </g>
            </svg>
          </div>
        )
}

SP.propTypes = {
    data : PropTypes.array,
    dims : PropTypes.array,
}
export function Axis (props){
    const node = useRef(props.axis)
    useEffect(() => {
        //const node = useRef(props.axis)
        select(node.current).call(props.scale)
    }, [])
  
    return (
        <g
          className="main axis date"
          transform={props.transform}
          ref={props.axis}
        />
    )
}
Axis.propTypes = {
    transform : PropTypes.string,
    axis : PropTypes.string,
    scale: PropTypes.func
}
export function RenderCircles(props){
      let renderCircles = props.data.map((coords, i) => (
        <circle
          cx={props.scale.x(coords[0])}
          cy={props.scale.y(coords[1])}
          r="8"
          style={{ fill: "rgba(25, 158, 199, .9)" }}
          key={i}
        />
      ))
      return <g>{renderCircles}</g>
}

RenderCircles.propTypes = {
    data : PropTypes.array,
    scale : PropTypes.object,
}

/*function linearRegression(y, x) {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;
    
    for (var i = 0; i < y.length; i++) {
      sum_x += x[i]
      sum_y += y[i]
      sum_xy += x[i] * y[i]
      sum_xx += x[i] * x[i]
      sum_yy += y[i] * y[i]
    }
    
    lr["slope"] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)
    lr["intercept"] = (sum_y - lr.slope * sum_x) / n
    lr["r2"] = Math.pow(
      (n * sum_xy - sum_x * sum_y) /
        Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
      2
    )
    
    return x => {
        return lr.slope * x + lr.intercept
    }
}*/
/*function sortNumber(a, b) {
    return a - b
}*/

/*export function TrendLine (props) {

    let x_coords = props.data.map(n => {
        return n[0]
    })
    let y_coords = props.data.map(n => {
        return n[1]
    })
    const trendline = linearRegression(y_coords, x_coords)
  
    // Lowest and highest x coordinates to draw a plot line
    const lowest_x = x_coords.sort(sortNumber)[0]
    const hightest_x = x_coords.sort(sortNumber)[x_coords.length - 1]
    const trendline_points = [
        [lowest_x, trendline(lowest_x)],
        [hightest_x, trendline(hightest_x)]
    ]
  
    return (
        <line
            x1={props.scale.x(trendline_points[0][0])}
            y1={props.scale.y(trendline_points[0][1])}
            x2={props.scale.x(trendline_points[1][0])}
            y2={props.scale.y(trendline_points[1][1])}
            style={{ stroke: "black", strokeWidth: "2" }}
        />
    )
}
TrendLine.propTypes = {
    data : PropTypes.object,
    scale : PropTypes.array,
}*/
  
