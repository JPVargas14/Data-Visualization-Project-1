console.log("Hello world");

// Read the data
d3.csv('data/gender_gap_education_levels.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset. HI THERE');
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
        // convert strings to numbers
        d.year = +d.year;

      	d.f_tertiary_enrollment_rates_combined_wb = +d.f_tertiary_enrollment_rates_combined_wb; 
		d.m_tertiary_enrollment_rates_combined_wb = +d.m_tertiary_enrollment_rates_combined_wb;

        d.f_primary_enrollment_rates_combined_wb = +d.f_primary_enrollment_rates_combined_wb;
        d.m_primary_enrollment_rates_combined_wb = +d.m_primary_enrollment_rates_combined_wb;

        d.total_net_enrolment_rate__lower_secondary__female__pct = +d.total_net_enrolment_rate__lower_secondary__female__pct;
        d.total_net_enrolment_rate__lower_secondary__male__pct = +d.total_net_enrolment_rate__lower_secondary__male__pct;

        d.total_net_enrolment_rate__upper_secondary__female__pct = +d.total_net_enrolment_rate__upper_secondary__female__pct;
        d.total_net_enrolment_rate__upper_secondary__male__pct = +d.total_net_enrolment_rate__upper_secondary__male__pct;
  	});

    // Filter data for OWID_ codes only
    const owidData = data.filter(d => d.code && d.code.startsWith('OWID_'));
    console.log('Total data rows:', data.length);
    console.log('OWID data points:', owidData.length);
    
    if (owidData.length === 0) {
        console.error('No OWID data found!');
        console.log('Sample codes:', data.slice(0, 5).map(d => d.code));
        return;
    }

    // Group data by code
    const groupedByCode = d3.group(owidData, d => d.code);
    console.log('Number of codes:', groupedByCode.size);
    console.log('Codes:', Array.from(groupedByCode.keys()));

    // Create main container
    const container = d3.select('body')
        .append('div')
        .attr('id', 'app-container')
        .style('padding', '20px');

    // Create controls container with two selects side by side
    const controlsContainer = container.append('div')
        .attr('id', 'controls-container')
        .style('display', 'flex')
        .style('gap', '40px')
        .style('margin-bottom', '30px');

    const codeArray = Array.from(groupedByCode.keys());
    const entityNames = codeArray.map(code => ({
        code: code,
        entity: groupedByCode.get(code)[0].entity || code
    })).sort((a, b) => a.entity.localeCompare(b.entity));

    // Function to create a select dropdown
    function createSelect(containerId, label) {
        const selectContainer = controlsContainer.append('div');

        selectContainer.append('label')
            .style('margin-right', '10px')
            .style('font-weight', 'bold')
            .text(label);

        const select = selectContainer.append('select')
            .attr('id', containerId)
            .style('padding', '8px')
            .style('font-size', '14px');

        select.selectAll('option')
            .data(entityNames)
            .enter()
            .append('option')
            .attr('value', d => d.code)
            .text(d => d.entity);

        return select;
    }

    // Create two selects
    const select1 = createSelect('entity-select-1', 'Left Chart:');
    const select2 = createSelect('entity-select-2', 'Right Chart:');

    // Set second select to second entity
    if (entityNames.length > 1) {
        select2.property('value', entityNames[1].code);
    }

    // Create charts container (two side by side)
    const chartsRow = container.append('div')
        .attr('id', 'charts-row')
        .style('display', 'flex')
        .style('gap', '8px')
        .style('margin-bottom', '40px');

    const chartContainer1 = chartsRow.append('div')
        .attr('id', 'chart-container-1')
        .style('flex', '1');

    const chartContainer2 = chartsRow.append('div')
        .attr('id', 'chart-container-2')
        .style('flex', '1');

    // Create difference chart container
    const differenceContainer = container.append('div')
        .attr('id', 'difference-chart-container');

    // Track current selections
    let currentCode1 = codeArray[0];
    let currentCode2 = entityNames.length > 1 ? entityNames[1].code : codeArray[0];
    let currentHistogram1 = null;
    let currentHistogram2 = null;
    let differenceHistogram = null;

    function updateCharts() {
        // Remove old charts
        chartContainer1.selectAll('*').remove();
        chartContainer2.selectAll('*').remove();
        differenceContainer.selectAll('*').remove();

        const codeData1 = groupedByCode.get(currentCode1);
        const entityName1 = codeData1[0].entity || currentCode1;
        const codeData2 = groupedByCode.get(currentCode2);
        const entityName2 = codeData2[0].entity || currentCode2;

        console.log(`Creating histogram 1 for ${currentCode1} with ${codeData1.length} rows`);
        console.log(`Creating histogram 2 for ${currentCode2} with ${codeData2.length} rows`);

        // Create first chart
        currentHistogram1 = new WordHistogram({
            parentElement: chartContainer1.node(),
            containerWidth: 700,
            containerHeight: 400,
            title: entityName1
        }, codeData1);

        // Create second chart
        currentHistogram2 = new WordHistogram({
            parentElement: chartContainer2.node(),
            containerWidth: 700,
            containerHeight: 400,
            title: entityName2
        }, codeData2);

        // Create difference chart
        createDifferenceChart(codeData1, codeData2, entityName1, entityName2);
    }

    function createDifferenceChart(data1, data2, name1, name2) {
        // Create a map of year to rates for each entity
        const map1 = new Map(data1.map(d => [d.year, d]));
        const map2 = new Map(data2.map(d => [d.year, d]));

        // Find all common years between the two datasets
        const commonYears = Array.from(map1.keys())
            .filter(y => map2.has(y))
            .sort((a, b) => a - b);

        console.log(`${name1} years:`, Array.from(map1.keys()).sort((a, b) => a - b).slice(0, 5), '...');
        console.log(`${name2} years:`, Array.from(map2.keys()).sort((a, b) => a - b).slice(0, 5), '...');
        console.log(`Common years between ${name1} and ${name2}:`, commonYears.length);
        console.log('Year range:', commonYears[0], 'to', commonYears[commonYears.length - 1]);

        if (commonYears.length === 0) {
            differenceContainer.append('p')
                .style('padding', '20px')
                .style('background-color', '#fff3cd')
                .text(`No overlapping years found between ${name1} and ${name2}. Please select entities with overlapping data.`);
            return;
        }

        // Calculate differences for all common years
        // Include points where at least one gender has valid data
        const diffData = commonYears.map(year => {
            const d1 = map1.get(year);
            const d2 = map2.get(year);
            
            const m1 = parseFloat(d1.m_primary_enrollment_rates_combined_wb);
            const m2 = parseFloat(d2.m_primary_enrollment_rates_combined_wb);
            const f1 = parseFloat(d1.f_primary_enrollment_rates_combined_wb);
            const f2 = parseFloat(d2.f_primary_enrollment_rates_combined_wb);
            
            return {
                year: year,
                maleRateDiff: (!isNaN(m1) && !isNaN(m2)) ? (m1 - m2) : null,
                femaleRateDiff: (!isNaN(f1) && !isNaN(f2)) ? (f1 - f2) : null
            };
        });

        // Filter to only include points with valid data for at least one gender
        const validDiffData = diffData.filter(d => d.maleRateDiff !== null || d.femaleRateDiff !== null);

        console.log('Valid difference data points:', validDiffData.length);
        console.log('Sample diff data:', validDiffData.slice(0, 3));

        if (validDiffData.length === 0) {
            differenceContainer.append('p')
                .style('padding', '20px')
                .style('background-color', '#fff3cd')
                .text(`No valid enrollment rate data for the overlapping years between ${name1} and ${name2}.`);
            return;
        }

        // Create difference chart using the same class
        const diffChartConfig = {
            parentElement: differenceContainer.node(),
            containerWidth: 1020,
            containerHeight: 350,
            title: `Difference: ${name1} - ${name2}`,
            isDifferenceChart: true
        };

        console.log('Creating difference chart with', validDiffData.length, 'points');
        differenceHistogram = new WordHistogram(diffChartConfig, validDiffData);
    }

    // Initial charts
    updateCharts();

    // Update charts when selects change
    select1.on('change', function() {
        currentCode1 = this.value;
        updateCharts();
    });

    select2.on('change', function() {
        currentCode2 = this.value;
        updateCharts();
    });

})
.catch(error => {
    console.error('Error loading the data');
});
