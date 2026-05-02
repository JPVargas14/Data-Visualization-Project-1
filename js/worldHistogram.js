class WordHistogram {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 300,
      margin: {top: 40, right: 50, bottom: 40, left: 60},
      title: _config.title || '',
      isDifferenceChart: _config.isDifferenceChart || false
    }

    this.data = _data; 

    this.initVis();
  }

  initVis() {
      let vis = this; 

      // Calculate inner chart size
      vis.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      // Define scales
      vis.xScale = d3.scaleLinear()
          .range([0, vis.innerWidth]);
      vis.yScale = d3.scaleLinear()
          .range([vis.innerHeight, 0]);

      // Define axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .tickFormat(d3.format('d'));
      vis.yAxis = d3.axisLeft(vis.yScale);

      // Define line generators
      vis.maleLineGenerator = d3.line()
          .defined(d => {
              if (vis.config.isDifferenceChart) {
                  return d.maleRateDiff !== null;
              }
              return d.m_primary_enrollment_rates_combined_wb != null;
          })
          .x(d => vis.xScale(d.year))
          .y(d => {
              if (vis.config.isDifferenceChart) {
                  return vis.yScale(d.maleRateDiff);
              }
              return vis.yScale(d.m_primary_enrollment_rates_combined_wb);
          });

      vis.femaleLineGenerator = d3.line()
          .defined(d => {
              if (vis.config.isDifferenceChart) {
                  return d.femaleRateDiff !== null;
              }
              return d.f_primary_enrollment_rates_combined_wb != null;
          })
          .x(d => vis.xScale(d.year))
          .y(d => {
              if (vis.config.isDifferenceChart) {
                  return vis.yScale(d.femaleRateDiff);
              }
              return vis.yScale(d.f_primary_enrollment_rates_combined_wb);
          });

      // Create SVG - handle both DOM nodes and selectors
      const parentElement = typeof vis.config.parentElement === 'string' 
          ? vis.config.parentElement 
          : vis.config.parentElement;
      
      vis.svg = d3.select(parentElement)
          .append('svg')
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);

      // Add title
      if (vis.config.title) {
          vis.svg.append('text')
              .attr('class', 'chart-title')
              .attr('x', vis.config.containerWidth / 2)
              .attr('y', 20)
              .style('text-anchor', 'middle')
              .style('font-weight', 'bold')
              .style('font-size', '16px')
              .text(vis.config.title);
      }

      // Add subtitle
      vis.svg.append('text')
          .attr('class', 'chart-subtitle')
          .attr('x', vis.config.containerWidth / 2)
          .attr('y', 35)
          .style('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('fill', '#666')
          .text(vis.config.isDifferenceChart ? 'Difference in Primary Enrollment Rates' : 'Primary Enrollment Rates');

      // Add group element for margins
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

      // Add X axis group
      vis.xAxisGroup = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.innerHeight})`);

      // Add Y axis group
      vis.yAxisGroup = vis.chart.append('g')
          .attr('class', 'axis y-axis');

      // Add X axis label
      vis.chart.append('text')
          .attr('class', 'axis-label')
          .attr('x', vis.innerWidth / 2)
          .attr('y', vis.innerHeight + 35)
          .style('text-anchor', 'middle')
          .text('Year');

      // Add Y axis label
      vis.chart.append('text')
          .attr('class', 'axis-label')
          .attr('y', 0 - vis.config.margin.left)
          .attr('x', 0 - (vis.innerHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .attr('transform', 'rotate(-90)')
          .text(vis.config.isDifferenceChart ? 'Difference (%)' : 'Enrollment Rate (%)');

      // Add legend
      const legend = vis.chart.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${vis.innerWidth - 150}, -25)`);

      legend.append('rect')
          .attr('width', 4)
          .attr('height', 4)
          .attr('fill', '#1b909a');
      legend.append('text')
          .attr('x', 10)
          .attr('y', 4)
          .style('font-size', '12px')
          .text('Male');

      legend.append('rect')
          .attr('y', 15)
          .attr('width', 4)
          .attr('height', 4)
          .attr('fill', '#7900f1');
      legend.append('text')
          .attr('x', 10)
          .attr('y', 19)
          .style('font-size', '12px')
          .text('Female');

      // Add tooltip
      vis.tooltip = d3.select(vis.config.parentElement).append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background-color', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('font-size', '12px')
          .style('z-index', '1000')
          .style('display', 'none')
          .style('white-space', 'nowrap');

      // Add hover line
      vis.hoverLine = vis.chart.append('line')
          .attr('class', 'hover-line')
          .attr('stroke', '#999')
          .attr('stroke-dasharray', '4')
          .attr('stroke-width', 1.5)
          .style('pointer-events', 'none')
          .style('display', 'none');

      // Add paths for lines
      vis.malePath = vis.chart.append('path')
          .attr('class', 'line male-line')
          .attr('fill', 'none')
          .attr('stroke', '#1b909a')
          .attr('stroke-width', 2);

      vis.femalePath = vis.chart.append('path')
          .attr('class', 'line female-line')
          .attr('fill', 'none')
          .attr('stroke', '#7900f1')
          .attr('stroke-width', 2);

      // Add hover overlay for tooltips
      vis.hoverArea = vis.chart.append('rect')
          .attr('class', 'hover-area')
          .attr('width', vis.innerWidth)
          .attr('height', vis.innerHeight)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .style('cursor', 'crosshair');

      console.log('SVG created, paths added');

      this.updateVis();
  }

  updateVis() {
      let vis = this;

      if (!vis.data || vis.data.length === 0) return;

      let filteredData;
      let rateExtent;

      if (vis.config.isDifferenceChart) {
          // For difference charts, filter out points where both male and female diffs are null
          filteredData = vis.data.filter(d => d.maleRateDiff !== null || d.femaleRateDiff !== null).sort((a, b) => a.year - b.year);
          
          if (filteredData.length === 0) return;
          
          console.log('Difference chart filtered data:', filteredData.length, 'points');
          console.log('Sample:', filteredData.slice(0, 3));
          
          // Get all valid difference values
          const allDiffs = [];
          filteredData.forEach(d => {
              if (d.maleRateDiff !== null) allDiffs.push(d.maleRateDiff);
              if (d.femaleRateDiff !== null) allDiffs.push(d.femaleRateDiff);
          });
          
          if (allDiffs.length === 0) return;
          
          const minDiff = d3.min(allDiffs);
          const maxDiff = d3.max(allDiffs);
          console.log('Diff range:', minDiff, 'to', maxDiff);
          const padding = Math.abs(maxDiff - minDiff) * 0.1;
          rateExtent = [minDiff - padding, maxDiff + padding];
      } else {
          // For regular charts, filter out rows with missing data
          filteredData = vis.data.filter(d => 
              d.f_primary_enrollment_rates_combined_wb != null && d.f_primary_enrollment_rates_combined_wb !== '' &&
              d.m_primary_enrollment_rates_combined_wb != null && d.m_primary_enrollment_rates_combined_wb !== ''
          ).sort((a, b) => a.year - b.year);

          if (filteredData.length === 0) return;

          rateExtent = [
              0,
              d3.max(filteredData, d => Math.max(d.f_primary_enrollment_rates_combined_wb, d.m_primary_enrollment_rates_combined_wb))
          ];
      }

      // Set domains
      const yearExtent = d3.extent(filteredData, d => d.year);
      console.log('Year extent:', yearExtent);
      console.log('Rate extent:', rateExtent);

      vis.xScale.domain(yearExtent);
      vis.yScale.domain(rateExtent).nice();

      // Draw lines
      console.log('Drawing lines with', filteredData.length, 'data points');
      console.log('Sample data points:', filteredData.slice(0, 3));
      
      const malePath = vis.maleLineGenerator(filteredData);
      const femalePath = vis.femaleLineGenerator(filteredData);
      console.log('Male path:', malePath ? malePath.substring(0, 50) : 'null');
      console.log('Female path:', femalePath ? femalePath.substring(0, 50) : 'null');

      vis.malePath.datum(filteredData)
          .transition()
          .duration(500)
          .attr('d', vis.maleLineGenerator);

      vis.femalePath.datum(filteredData)
          .transition()
          .duration(500)
          .attr('d', vis.femaleLineGenerator);

      // Update axes
      vis.xAxisGroup.call(vis.xAxis)
          .selectAll('text')
          .style('font-size', '11px');

      vis.yAxisGroup.call(vis.yAxis)
          .selectAll('text')
          .style('font-size', '11px');

      // Store filtered data for hover interaction
      vis.filteredData = filteredData;

      // Add hover interaction
      vis.hoverArea.on('mousemove', function(event) {
          const mouseX = d3.pointer(event)[0];
          const year = vis.xScale.invert(mouseX);

          // Show and position vertical line
          vis.hoverLine
              .style('display', 'block')
              .attr('x1', mouseX)
              .attr('x2', mouseX)
              .attr('y1', 0)
              .attr('y2', vis.innerHeight);

          // Find closest data point
          let closestPoint = null;
          let minDist = Infinity;

          vis.filteredData.forEach(d => {
              const dist = Math.abs(d.year - year);
              if (dist < minDist) {
                  minDist = dist;
                  closestPoint = d;
              }
          });

          if (closestPoint) {
              let tooltipText = `Year: ${closestPoint.year}<br>`;

              if (vis.config.isDifferenceChart) {
                  tooltipText += `Male Diff: ${closestPoint.maleRateDiff !== null ? closestPoint.maleRateDiff.toFixed(2) : 'N/A'}%<br>`;
                  tooltipText += `Female Diff: ${closestPoint.femaleRateDiff !== null ? closestPoint.femaleRateDiff.toFixed(2) : 'N/A'}%`;
              } else {
                  tooltipText += `Male: ${closestPoint.m_primary_enrollment_rates_combined_wb.toFixed(2)}%<br>`;
                  tooltipText += `Female: ${closestPoint.f_primary_enrollment_rates_combined_wb.toFixed(2)}%`;
              }

              vis.tooltip
                  .style('display', 'block')
                  .html(tooltipText)
                  .style('left', (event.pageX + 10) + 'px')
                  .style('top', (event.pageY - 28) + 'px');
          }
      })
      .on('mouseout', function() {
          vis.tooltip.style('display', 'none');
          vis.hoverLine.style('display', 'none');
      });
  }
}