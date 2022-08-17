// before opening index.html, navigate to directory in terminal and execute: python -m http.server [port #]
// copy http address into browser
// if chrome console shows errors due to files in a diferent directory, clear the cache in chrome and retry


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
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

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(newObject => newObject.id === sample);

    //  5. Create a variable that holds the first sample in the array.
    var newSample = filteredSample[0];
    console.log(newSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = newSample.otu_ids;
    var otuLabels = newSample.otu_labels;
    var sampleValues = newSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // Chain slice() with map() and reverse() to retrieve the top 10 otu_ids in descending order.
    var yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse()
      ,y: yticks
      ,type: "bar"
      ,orientation: "h"
  }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
     ,xaxis: {title: "Count"}
     ,yaxis: {title: "Operational Taxon Unit"}
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    
    // Bubble chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs
      ,y: sampleValues
      ,text: otuLabels
      ,mode: 'markers'
      ,marker: {
        size: sampleValues
        ,color: otuIDs
        ,colorscale: 'Portland'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial cultures by sample"
      ,xaxis: {title: "OTU ID"}
      ,yaxis: {title: "Count"}
      ,autosize: true
      ,margin: {t: 60, r: 0, b: 60, l: 60}
      //,automargin: true
      ,hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    // Gauge chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var newSample = filteredSample[0];
    var otuIDs = newSample.otu_ids;
    var otuLabels = newSample.otu_labels;
    var sampleValues = newSample.sample_values;

    // 3. Convert washing frequency to float
    var washFreq = parseFloat(result.wfreq);
    console.log(washFreq)
    console.log(washFreq.className)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      title: { text: "Scrubs Per Week", font: { size: 18 } },
      gauge: {
        axis: { range: [0, 10], tickwidth: 2.5, tickcolor: "dimgray",
          tick0: 0, dtick: 2 },
        bar: { color: "darkblue", thickness: 0.4, line: {color: "black", width: 0 }},
        bgcolor: "white",
        borderwidth: 3,
        bordercolor: "dimgray",
        steps: [
          { range: [0, 2], color: "darkgoldenrod" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "gold" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "limegreen" }
        ]
      }
    }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "Belly Button Wash Frequency", font: {size: 22}}
      ,xaxis: {title: "OTU ID"}
      ,yaxis: {title: "Count"}
      ,autosize: true
      ,margin: {t: 60, r: 40, b: 60, l: 60}
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData, gaugeLayout);
    
  });
}