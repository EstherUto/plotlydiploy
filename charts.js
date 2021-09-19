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
    // Create a variable that filters the samples for the object with the desired sample number.
    var filtered = samples.filter(num => num.id == sample);
    console.log(filtered);
    //  Create a variable that holds the first sample in the array.
    var result = filtered[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_otuIDs = result.otu_ids;
    var sample_values = result.sample_values;
    var sample_labels = result.otu_labels;

    // Create a variable that filters the samples for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // Create a variable that holds the washing frequency.
    wfreq = result.wfreq;

// --- BAR CHART --- //

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sample_otuIDs.map(id => `OTU ${id}`).slice(0,10).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: sample_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: sample_otuIDs,
        colorscale: 'Picnic'
      }
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
     title: {
      text:'Top ten Bacteria Cultures Found', 
      font: {size: 22}
    },
     xaxis: {title: ""},
     yaxis: {title: "OTU IDs"},
     paper_bgcolor: 'rgb(186, 197, 211)',
     font: {family: "Times New Roman"},
     showlegend: false
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// --- BUBBLE CHART --- //

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: sample_otuIDs,
      y: sample_values,
      text: sample_labels,
      mode: 'markers',
      marker: {
        color: sample_otuIDs,
        size: sample_values,
        colorscale: 'Picnic'
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text:'Bacteria Cultures Per Sample', 
        font: {size: 26}
      },
      xaxis: {title: "OTU IDs"},
      yaxis: {title: ""},
      paper_bgcolor: 'rgb(186, 197, 211)',
      font: {family: "Times New Roman"} ,
      showlegend: false
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// --- GAUGE CHART --- //

    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {
        x: [0,1],
        y: [0,1]
      },
      value: wfreq,
      title: {
        text: "Belly Button Washing Frequency", 
        font: {size: 22},
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"greenyellow"},
          {range: [8,10], color:"green"}
        ],
        threshold: {
          line: {color: "red", width: 4},
          thickness: 0.75,
          value: 7
        },
        bar: {color:"black"}
    }
    }];

    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 550,
      height: 500,
      paper_bgcolor: 'rgb(186, 197, 211)',
      font: {family: "Times New Roman"} 
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
