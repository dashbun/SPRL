import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SOMNode {
  x: number;
  y: number;
  isOutbreak: boolean;
  weight: number[];
}

interface SOMVisualizationProps {
  data: SOMNode[];
  width?: number;
  height?: number;
  gridSize?: number;
}

const SOMVisualization: React.FC<SOMVisualizationProps> = ({
  data,
  width = 600,
  height = 600,
  gridSize = 10
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, gridSize - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, gridSize - 1])
      .range([0, innerHeight]);

    // Create color scale for weights
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([0, 1]);

    // Create main group and apply margin
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw grid
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', innerWidth / gridSize)
      .attr('height', innerHeight / gridSize)
      .attr('fill', d => colorScale(d.weight[0]))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Draw outbreak markers
    g.selectAll('circle')
      .data(data.filter(d => d.isOutbreak))
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x) + (innerWidth / gridSize) / 2)
      .attr('cy', d => yScale(d.y) + (innerHeight / gridSize) / 2)
      .attr('r', 4)
      .attr('fill', 'red')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    // Add labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom)
      .attr('text-anchor', 'middle')
      .text('SOM Grid X');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left)
      .attr('text-anchor', 'middle')
      .text('SOM Grid Y');

    // Add legend
    const legendWidth = 20;
    const legendHeight = innerHeight;
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 20},${margin.top})`);

    const legendScale = d3.scaleLinear()
      .domain([1, 0])
      .range([0, legendHeight]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d => d.toString());

    const gradientData = d3.range(0, 1.01, 0.01).reverse();

    legend.selectAll('rect')
      .data(gradientData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * (legendHeight / gradientData.length))
      .attr('width', legendWidth)
      .attr('height', legendHeight / gradientData.length + 1)
      .attr('fill', d => colorScale(d));

    legend.append('g')
      .attr('transform', `translate(${legendWidth},0)`)
      .call(legendAxis);

    legend.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -legendHeight / 2)
      .attr('y', legendWidth + 35)
      .attr('text-anchor', 'middle')
      .text('Weight Value');

  }, [data, width, height, gridSize]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default SOMVisualization;