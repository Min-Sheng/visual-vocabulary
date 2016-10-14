
function scatterplot(data,stylename,media,plotpadding,legAlign,yAlign, yMin,yMax,xMin,yMax,numTicksx,numTicksx, yAxisHighlight,axisLabel,xaxisLabel,yaxisLabel){
    var titleYoffset = d3.select("#"+media+"Title").node().getBBox().height
    var subtitleYoffset=d3.select("#"+media+"Subtitle").node().getBBox().height;

    // return the series names from the first row of the spreadsheet
    var seriesNames = Object.keys(data[0]).filter(function(d){ return d != 'date'; });
    //Select the plot space in the frame from which to take measurements
    var frame=d3.select("#"+media+"chart")
    var plot=d3.select("#"+media+"plot")

    var yOffset=d3.select("#"+media+"Subtitle").style("font-size");
    yOffset=Number(yOffset.replace(/[^\d.-]/g, ''));
    
    //Get the width,height and the marginins unique to this chart
    var w=plot.node().getBBox().width;
    var h=plot.node().getBBox().height;
    var margin=plotpadding.filter(function(d){
        return (d.name === media);
      });
    margin=margin[0].margin[0]
    var colours=stylename.linecolours;
    var plotWidth = w-(margin.left+margin.right);
    var plotHeight = h-(margin.top+margin.bottom);
    
    //calculate range of time series 
    var xDomain = d3.extent(data, function(d) {return +d.x;});
    var yDomain = d3.extent(data, function(d) {return +d.y;});

    xDomain[0]=Math.min(xMin,xDomain[0]);
    xDomain[1]=Math.max(xMax,xDomain[1]);
    yDomain[0]=Math.min(yMin,yDomain[0]);
    yDomain[1]=Math.max(yMax,yDomain[1]);

    var plotData = d3.nest()
        .key(function(d) { return d.cat;})
        .entries(data);

    var yScale=d3.scale.linear()
        .domain(yDomain)
        .range([plotHeight,0])

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(numTicksy)
        .orient("left")

    var yLabel=plot.append("g")
    .attr("class",media+"yAxis")
    .call(yAxis);

    //calculate what the ticksize should be now that the text for the labels has been drawn
    var yLabelOffset=yLabel.node().getBBox().width;
    var yticksize=colculateTicksize(yAlign, yLabelOffset);

    yLabel.call(yAxis.tickSize(yticksize))
    yLabel
        .attr("transform",function(){
                return "translate("+(w-margin.right)+","+margin.top+")"
            });

    //identify 0 line if there is one
    var originValue = 0;
    var origin = plot.selectAll(".tick").filter(function(d, i) {
            return d==originValue || d==yAxisHighlight;
        }).classed(media+"origin",true);

    var xScale = d3.scale.linear()
        .domain(xDomain)
        .range([0,(plotWidth-yLabelOffset)]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(numTicksx)
        .tickSize(yOffset/2)
        .orient("bottom");

    var xLabel=plot.append("g")
        .attr("class",media+"xAxis")
        .attr("transform",function(){
            return "translate("+(margin.left+yLabelOffset)+","+(h-margin.bottom)+")"
        })
        .call(xAxis);

    if (axisLabel) {
        plot.append("text")
            .attr("class",media+"subtitle")
            .attr("text-anchor", "end")
            .attr("x", plotWidth+margin.left)
            .attr("y", plotHeight+margin.top-(yOffset/4))
            .text(xaxisLabel);
        plot.append("text")
            .attr("class",media+"subtitle")
            .attr("text-anchor", "start")
            .attr("x", 0)
            .attr("y", margin.top-yOffset/2)
            .text(yaxisLabel);
        }

    var category = plot.selectAll("."+media+"category")
        .data(plotData)
        .enter()
        .append("g")
        .attr("id", media+(function(d) {return d.key}))
        .attr("transform", function(d) {return "translate(0,0)"; })
        .attr("class", media+"category")
        .call (addDots)

    function addDots(dataset) {
        console.log(dataset)


    }









    function colculateTicksize(align, offset) {
        if (align=="right") {
            return w-margin.left-offset
        }
        else {return w-margin.right-offset}
    }

}