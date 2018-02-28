/**
 * @author user
 */



function CansChart(divid,programid){
	this.divid=divid;
	this.programid=programid;
	
	this.domains = [];
	this.items = [];
	
	this.drilledDown=false;
	
	this.getCansData = function(programid){
		params={};
		ep.getFunctionAsObjectJSON("6101",{pid:programid},this.dataready,this);
	};
	
	this.dataready=function(json){
		this.domains=json.domains;
		this.items = json.items;
		this.renderBasicDomains();
	};
	this.renderBasicDomains=function(){
		this.drilledDown=false;
		if(this.chart.series.length>0)this.chart.series[0].remove(false);
		this.chart.setTitle({text:"CANS Domain Scores"},{text:"Average by Domain"});
		var series = {
			id:'domains',
			name:'CANS Domains',
			color: "#4572A7",
			data:[]
		};
		var categories = [];
		for(var i=0;i<this.domains.length;i++){
			var domain = this.domains[i];
			if(domain.isbasic){
				var dp = {name:domain.domainlabel,y:this.formatNumber(domain.score.mean),data:domain,parentObject:this};
				categories.push(domain.domainlabel);
				series.data.push(dp);
				
			}
		}
		this.chart.xAxis[0].categories=categories;
		this.chart.addSeries(series);
		
		
	};
	
	this.doDrill=function(data){
		var scores = data.score.scores;
		this.drilledDown=true;
		var array=this.makeHistogram(scores);
		categories = [];
		this.chart.setTitle({text:data.domainlabel},{text:"Frequencies"});
		
		this.chart.xAxis[0].setCategories(categories, false);
		this.chart.series[0].remove(false);
		this.chart.addSeries({name:data.domainlabel,"data":array,color: "#AA4643"},false);
		this.chart.redraw();
	};
	this.errorFunction=function(jqXHR, textStatus, errorThrown){
		alert(errorThrown);
	},
	 this.chart = new Highcharts.Chart({
            chart: {
                renderTo: divid,
                type: 'column'
            },
            title: {
                text: 'Cans Domain Scores',
                x: -20 //center
            },
            subtitle: {
                text: 'Average By Domain',
                x: -20
            },
            xAxis: {
                catgories: [],
                  labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Average Score'
                }
            },
            legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                shadow: true
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        this.x +': '+ this.y +' ';
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                     point: {
                        events: {
                            click: function() {
                                var data = this.data;
                                
                                if (this.parentObject.drilledDown) { // restore
                                    this.parentObject.renderBasicDomains();
                                } else { // drill
                                    this.parentObject.doDrill(data);
                                }
                            }
                        }
                    },
                }
            },
                series: []
        });
        
        
        this.formatNumber=function(number){
        	if(number){
        		var n = new Number(number);
        		if(n){
        			var n = new Number(n.toPrecision(3));
        			return n.valueOf();
        		}
        		else return number;
        	}else{
        		return number;
        	}
        };
        
        
        this.makeHistogram=function(doubleArray){
        	var objectArray = new Object();
        	var nIntervals = 10;
        	var max = 1;
        	var min = 0;
        	var distance=1;
        	var n=0;
        	for(var i=0;i<doubleArray.length;i++){
        		var num = doubleArray[i];
        		max = Math.max(num,max);
        		min = Math.min(num,min);
        		n++;
        	}
        	distance = max-min;
        	if(n>0&&distance>0){
        		var interval = distance/nIntervals;
        		var outArr = new Array();
        		for(var i=0;i<nIntervals;i++){
        			var lower = min+(i*interval);
        			var upper = lower+interval;
        			var nInHere = 0;
        			for(var j=0;j<doubleArray.length;j++){
        				var num = doubleArray[j];
        				if(num>=lower&&num<upper){
        					nInHere++;
        				}
        			}
        			var obj = {x:lower,y:nInHere,parentObject:this};
        			outArr.push(obj);
        		}
        		return outArr;
        	}else{
        		return new Array();
        	}
        };
        
        this.popUpCansItems=function(domitem){
        	var div = document.getElementById("newContent");
        	if(div==null){
        		div=document.createElement('div');
        		document.body.appendChild(div);
        	} 
        	div.innerHTML='';
        	div.id='newContent';
        	div.style="visible:none";
        	for(var i=0;i<this.domains.length;i++){
        		var domain = this.domains[i];
        		var domaindiv = document.createElement("div");
        		var table = document.createElement("table");
        		
        		var row = table.insertRow(-1);
				var cell = row.insertCell(-1);
        		var dt = document.createElement("div");
        		dt.innerHTML = "<b>"+domain.domainlabel+"</b>";
        		cell.appendChild(dt);
        		
        		for(var j=0;j<this.items.length;j++){
        			var item = this.items[j];
        			if(item.domainid==domain.id){
        				row = table.insertRow(-1);
						cell = row.insertCell(-1);
						cell.width=400;
        				dt = document.createElement("div");
        				dt.innerHTML = item.itemlabel;
        				cell.appendChild(dt);
        				cell = row.insertCell(-1);
        				cell.appendChild( this.getItemGraphic(item));
        				
        			}
        		}
        		
        		domaindiv.appendChild(table);
        		div.appendChild(domaindiv);
        	}
        	
        	hs.htmlExpand(domitem,{width: 800,
					headingText: 'Cans Items', 
					maincontentId: 'newContent',
					wrapperClassName: 'draggable-header'});
        }
        this.getItemGraphic=function(item){
        	var totalWidth=150;
        	var itemheight=10;
        	var percentages = item.score.percentages;
        	var NS="http://www.w3.org/2000/svg";
			var svg=document.createElementNS(NS,"svg");
			svg.setAttribute("width",totalWidth+10);
			svg.setAttribute("height",itemheight+5);
			var currloc=0;
			for(var i=0;i<4;i++){
				var SVGObj=document.createElementNS(NS,"rect");
				SVGObj.setAttribute("height",itemheight);
				var iw = totalWidth*(percentages[i]/100);
				SVGObj.setAttribute("width",iw);
				SVGObj.setAttribute("x",currloc);
				SVGObj.setAttribute("y",5);
				if(i==0)SVGObj.setAttribute("class","greenbox");
				else if(i==1)SVGObj.setAttribute("class","yellowbox");
				else SVGObj.setAttribute("class","redbox");
				SVGObj.item=item;
				currloc+=iw+3;
				svg.appendChild(SVGObj);
				SVGObj.onmouseover=function(){
					mtToolTip.ShowTip(event.x,event.y,this.item.itemname);
				};
				SVGObj.onmouseout=function(){
					mtToolTip.HideTip();
				};
				
			}
			return svg;
			
        }
        
	
}

var mtToolTip={
	tip:null,
	
	ShowTip:function(x,y,innerHtml){
		if(this.tip==null){
			this.tip = document.createElement("div");
			this.tip.className="mtToolTip";
			document.body.appendChild(this.tip);
	
		}
		x=x+5;
		y=y+5;
		this.tip.style.display="block";
		this.tip.innerHTML=innerHtml;
		this.tip.style.left=x+'px';
		this.tip.style.top=y+'px';
	},
	HideTip:function(){
		this.tip.style.display="none";
	}
	
};
