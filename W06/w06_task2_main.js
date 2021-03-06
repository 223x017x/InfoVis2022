d3.csv("https://223x017x.github.io/InfoVis2022/W04/task1data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y;  });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:30, left:40}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
	    

	self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin - 20, xmax + 20] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin - 20, ymax + 20] );

        self.render();
    }

    render() {
        let self = this;

         self.svg.append("text")
	    .attr("x", 128)
	    .attr("y", 10)
	    .attr("font-size", "13px")
	    .attr("text-anchor", "top")
	    .attr("font-weight", 700)
	    .text("title");

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis )
	      .append("text")
	      .attr("fill","black")
	      .attr("x",self.inner_width/2)
	      .attr("y",30)
	      .attr("text-anchor", "middle")
              .attr("font-size", "10pt")
              .attr("font-weight", "middle")
	      .text("xlabel")
	;
	self.yaxis_group
	    .call( self.yaxis )
	    .append("text")
	    .attr("fill", "black")
	    .attr("text-anchor", "middle")
	    .attr("x", -(self.inner_height/2))
	    .attr("y", -25)
	    .attr("transform", "rotate(-90)")
	    .attr("font-weight", "middle")
	    .attr("font-size", "10pt")
	    .text("ylabel");;
    }
}
