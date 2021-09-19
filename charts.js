function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  console.log("option changed to " + newSample)
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array.
    var samples = data.samples;
    console.log(samples);
    // Create a variable that filters the samples for the object with the desired sample number.
    var filtered = samples.filter(num => num.id == sample);
    console.log(filtered);
    //  Create a variable that holds the first sample in the array.
    var result = filtered[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_otuIDs = filtered.map(id => id.otu_ids);
    var sample_values = filtered.map(id => id.sample_values);
    var sample_labels = filtered.map(id => id.otu_labes);

    // Create a variable that filters the samples for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // Create a variable that holds the washing frequency.
    wfreq = data.metadata.map(person => person.wfreq);
    filteredWfreq = wfreq.filter(element => element != null);

// --- BAR CHART --- //

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var yticks = filtered.sort((firstValue, secondValue) => secondValue - firstValue);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_otuIDs,
      // y: yticks,
      y: sample_values,
      text: sample_labels,
      type: 'bar',
      orientation: 'h'
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
     title: "OTUs Bar Chart",
     xaxis: {title: "OTU IDs"},
     yaxis: {title: "Sample Values"},
     showlegend: true
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// --- BUBBLE CHART --- //

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sample_otuIDs,
      y: sample_values,
      text: sample_labels,
      mode: 'markers',
      // marker: {
      //   color: [],
      //   size: [],
      //   colorscale: []
      // }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'OTUs Bubble Chart',
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"},
      showlegend: true
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// --- GAUGE CHART --- //

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {
        x: sample_otuIDs,
        y: sample_values
      },
      value: filteredWfreq,
      title: {text: "OTUs Guage"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {axis: {range: [null, 10]}}
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
