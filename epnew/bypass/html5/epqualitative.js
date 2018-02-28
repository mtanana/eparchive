var epqualitative = {
	currPid:-99,
	qualFields:[],
	editable:false,
	
	getQualitativeForProgram: function(programid){
		if(ep.userData.user.isSuper=="true")this.editable=true;
		else this.editable=false;
		this.qualFields=[];
		this.currPid=programid;
		ep.getFunctionAsObjectJSON("1701",{pid:programid},this.dataready,this);
	},
	dataready:function(data){
		var qual = data.result;
		if(qual)this.qualFields=qual;
		this.refreshDocument();
	},
	
	
	/*
	 * this relies on tags with the structure:
	 * 
	 * <div name="epqf" data-fieldname="fieldname" data-fieldtype="textbox"></div>
	 * 
	 */
	refreshDocument:function(){
		//this is a node list (which acts like an array)
		var nodes = document.getElementsByName("epqf");
		for(var i=0;i<nodes.length;i++){
			var node= nodes[i];
			var type = node.getAttribute('data-fieldtype');
			var fieldname = node.getAttribute('data-fieldname');
			var data = this.getDataForField(fieldname);
			node.innerHTML="";
			if(type=="textbox")EPQualTextbox.setData(data,node,this.editable);
		}
	},
	getDataForField:function(fieldname){
		for(var i=0;i<this.qualFields.length;i++){
			var qf = this.qualFields[i];
			if(qf.field==fieldname)return qf;
		}
	},
	
	
	
	editQualitativeField:function(field,data,num){
		var params = {
			pid:currPid,
			"field":field,
			"data":data,
			"num":num
		};
		ep.getFunctionAsObject("1702",params,this.updateReady,this);
	},
	updateReady:function(json){
		
	}

	


};

var EPQualTextbox = {
	popup:null,
	
	setData:function(data,node,editable){
		node.innerHtml="";
		var div = document.createElement('div');
		node.appendChild(div);
		if(editable)node.appendChild(this.getEditButton());
	},
	//return an element
	getEditButton:function(){
		var ib = document.createElement("div");
		ib.className="editButton";
		ib.onclick=EPQualTextbox.doEdit;
		return ib;
		
	},
	doEdit:function(event){
		if(this.popup==null){
			this.popup=new EPPopUp();
			var div = this.popup.innerElement;
			var textBox = document.createElement("textarea");
			textBox.id="popuptextedit";
			div.appendChild(textBox);
			var button = document.createElement("a");
			button.className="checkbutton";
			button.innerHTML="<span>Update</span>";		
			button.onclick= this.doUpdate;
			div.appendChild(button);
		}
		
	},
	doUpdate:function(event){
		var textBox = document.getElementById("popuptextedit");
		var newText=textBox.innerHTML;
	}
};
var EPQualStoplight = {
	
	
};
