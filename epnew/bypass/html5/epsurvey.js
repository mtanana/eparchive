epsurvey = {
	
	surveyDivName:"#surveyDiv",
	nQinGroup:6,
	doSkew:true,
	currSurveyData: {},
	pageArray: [],
	swiper:{},
	
	
	
	checkASetID: -6,
	checkYesID: -2,
	checkNoID:3,
	
	
	
	
	renderSurveyForGrantId:function(grantid){
		ep.getFunctionAsObject(1401,{gid:grantid},this.surveyReady,this);
	},
	renderSurveyInProgressForSRID:function(srid){
		ep.getFunctionAsObject(1404,{'srid':srid},this.surveyReady,this);
	},
	
	surveyReady:function(json){
		this.buildSurvey(json);
	},
	listenForHeightChange:function(div){
		div.addEventListener("onload",this.heightChanged);
	},
	heightChanged:function(event){
		var item = event.target;
		var h=item.offsetHeight;
		var w=item.offsetWidth;
	},
	buildSurvey:function(json){
		this.currSurveyData = json;
		var sdiv = $(this.surveyDivName);
		sdiv.empty();
		var questions = getObjectAsArray(json.question);
		var lgQuestions=new Array();
		var currlgid=-99;
		var currlgquestion = "";
		this.pageArray = new Array();
		var divArray = new Array();
		for(var i=0;i<questions.length;i++){
			var question = questions[i];
			var type= question.type;
			if(type=="instruction"){
				var div = this.getInstruction(question);
				divArray.push(div);
			}else if(type=="text"){
				var div = this.getTextResponse(question);
				divArray.push(div);
			}else if(type=="likert"){
				var div = this.getLikert(question);
				divArray.push(div);
			}else if(type=="likertgroup"){
				
				//if this is a new list
				if(currlgid==-99){
					currlgid=question.answerset;
					currlgquestion = question.text;
				}
					
				if(currlgid==question.answerset&&currlgquestion==question.text){
					lgQuestions.push(question);
				}
				
				
				//check to see if the next question is the same LG (or if we are at the end of the line)
				var nextQuestSameLG = false;
				if(i<questions.length-1){
					var nq = questions[i+1];
					if(currlgid==nq.answerset&&currlgquestion==nq.text){
						nextQuestSameLG = true;
					}
				}
				
				if(lgQuestions.length==this.nQinGroup||!nextQuestSameLG){
					var div;
					if(currlgid==this.checkASetID)div =  this.getCheckboxGroup(lgQuestions);
					else div=this.getLikertGroup(lgQuestions);
					divArray.push(div);
					
					currlgid=-99;
					lgQuestions = new Array();
				}
				
				
				
			}
			
			
		}
		if(lgQuestions.length>0)alert("Didn't clear out all LG Items!");
		this.pageArray = this.pageDivArray(divArray);
		//sdiv.append(this.pageArray[2]);
		this.addPagesToSwipey();
		this.setRadioButtons();
	},
	
	setRadioButtons:function(){
		
	},
	getInstruction:function(question) {
		var div = document.createElement("div");
		div.className = "questionHeader question surveyText instruction";
		div.innerHTML = question.text;
		return div;
	},
	getLikert:function(question) {
		var div = document.createElement("div");
		var textDiv = document.createElement("div");
		textDiv.className="questionHeader";
		div.className = "question surveyText likert";
		div.innerHTML = question.text;
		div.appendChild(textDiv);
		
		var hascurrentanswer = question.hascurrentanswer;
		var currentanswerid = question.currentanswerid;
		
		var table = document.createElement("table");
		var answers = getObjectAsArray(question.answer);
		
		for(var i=0;i<answers.length;i++){
			var row = table.insertRow(-1);
			var cell=row.insertCell(-1);
			var cell2=row.insertCell(-1);
			cell.className="likertrbcell";
			var answer = answers[i];
			var selected = hascurrentanswer&&answer.aid==currentanswerid;
			var rb = ImageButtons.getNewRadioButton(question.rid,selected);
			var data = new Object();
			data.rid = question.rid;
			data.aid = answer.aid;
			data.atext=answer.text;
			rb.data = data;
			rb.addEventListener("click",this.fixedAnswerUpdate,false);
			
			cell.appendChild(rb);
			
			var text =document.createElement("div");
			text.innerHTML=answer.text;
			
			
			cell2.appendChild(text);
			
			
		}
		
		
		div.appendChild(table);
		return div;
	},
	getTextResponse:function(question){
		var hascurrentanswer = question.hascurrentanswer;
		var currentanswerstring = question.currentanswerstring;
		var div = document.createElement("div");
		var textDiv = document.createElement("div");
		textDiv.className="questionHeader";
		div.className = "question surveyText textresponse";
		div.innerHTML = question.text;
		div.appendChild(textDiv);
		var rdiv = document.createElement("div");
		var ti = document.createElement("textarea");
		rdiv.appendChild(ti);
		div.appendChild(rdiv);
		ti.onkeyup = this.openanswerUpdate;
		ti.onpaste = this.openanswerUpdate;
		var data = new Object();
		data.rid = question.rid;
		ti.data = data;
		
		if(hascurrentanswer&&currentanswerstring!=null)ti.value=currentanswerstring;
		return div;
	},
	getCheckboxGroup:function(qa){
		
		var fq = qa[0];
		var maindiv = document.createElement("div");
		maindiv.className = "question surveyText checkboxgroup";
		var textDiv = document.createElement("div");
		textDiv.innerHTML = fq.text;
		textDiv.className="questionHeader";
		maindiv.appendChild(textDiv);
		var table = document.createElement("table");
		for(var i=0;i<qa.length;i++){
			var row = table.insertRow(-1);
			var cell=row.insertCell(-1);
			var cell2=row.insertCell(-1);
			cell2.className = "checkcell";
			var question = qa[i];
			var hascurrentanswer = question.hascurrentanswer;
			var currentanswerid = question.currentanswerid;
			cell.innerHTML = question.subtext;
			var cb = document.createElement("input");
			cb.type = "checkbox";
			if(hascurrentanswer&&currentanswerid==-2)cb.checked=true;
			cell2.appendChild(cb);
			
			
		}
		maindiv.appendChild(table);
		return maindiv;
	},
	getLikertGroup:function(qa){
		var fq = qa[0];
		var answers = fq.answer;
		var maindiv = document.createElement("div");
		maindiv.className = "question surveyText likertgroup";
		
		var textDiv = document.createElement("div");
		textDiv.innerHTML = fq.text;
		textDiv.className="questionHeader";
		maindiv.appendChild(textDiv);
		
		var cols = fq.answer.length;
		var table = document.createElement("table");
		maindiv.appendChild(table);
		var header=table.createTHead();
  		var row=header.insertRow(-1);
  		
		var cell=row.insertCell(-1);  //empty cell
		/*
			 * Check to see how long the answer are....
			 * if they are long, go for noskew
			 * if short and the browser can handle it, skew
			 */
		var maxlength = 0;
		for(var i=0;i<cols;i++){
			var answer = answers[i];
			var length = answer.text.length;
			maxlength = Math.max(maxlength,length);
		}
					
		for(var i=0;i<cols;i++){
			var answer = answers[i];
			var cell=document.createElement("th");
			var div = document.createElement("div");
			if(this.doSkew&&maxlength<24)cell.className="skew";
			
			var span = document.createElement("span");
			span.innerHTML = answer.text;
			if(isEven(i))div.className = "odd";
			div.appendChild(span);
			cell.appendChild(div);
			row.appendChild(cell);
		}
	
	
		var body= document.createElement("tbody");
	
		for(var i=0;i<qa.length;i++){
			var question = qa[i];
			var hascurrentanswer = question.hascurrentanswer;
			var currentanswerid = question.currentanswerid;
			var row = body.insertRow(-1);
			var qcell=row.insertCell(-1);  //q
			var qdiv = document.createElement("div");
			qdiv.className="likertgroupquestion";
			qdiv.innerHTML = question.subtext;
			qcell.appendChild(qdiv);
			for(var j=0;j<cols;j++){
				var answer = answers[j];
				var cell=row.insertCell(-1);
				var celldiv = document.createElement("div");
				celldiv.className="likertgroupbutton";
				var selected = (hascurrentanswer&&answer.aid==currentanswerid);
				var rb = ImageButtons.getNewRadioButton(question.rid,selected);
				rb.addEventListener("click",this.fixedAnswerUpdate,false);
				
			
				var data = new Object();
				data.rid = question.rid;
				data.aid = answer.aid;
				data.atext=answer.text;
				rb.data = data;
				
				
				if(isEven(j))cell.className = "odd";
				
				celldiv.appendChild(rb);
				cell.appendChild(celldiv);
			}
		}
	
		
		
		table.appendChild(body);
		return maindiv;
		
	},
	fixedAnswerUpdate:function(event){
		var a = this;
		
		//we can call this statically
		epsurvey.updateResult(a.data.rid,a.data.aid,a.data.atext,-99);
	},
	
	//the open answer update uses a timer so we don't make too many server calls
	openanswerUpdate:function(event){
		//this will refer to the textbox
		var text = this.value;
		var rid = this.data.rid;
		
		if(this.timer==null){
			this.timer = setTimeout(function(){epsurvey.updateResult(rid,-1,text,-99);},3000);
		}else{
			clearTimeout(this.timer);
			this.timer = setTimeout(function(){epsurvey.updateResult(rid,-1,text,-99);},3000);
		}
	},
	checkUpdate:function(event){
		//update function for the checkbox
		/*
		 * NEED TO WRITE THIS
		 */
	},
	updateResult:function(rid, aid, atext,time) {
		var params={rid: rid,aid:aid,atext:atext,time:time};
		ep.getFunctionAsObject(1402,params,this.resultUpdated,this);
	},
	
	markSurveyAsDone:function(srid){
		var params={srid:srid};
		ep.getFunctionAsObject(1403,params,this.surveyIsDone,this);
	},
	surveyIsDone:function(json){
		if(json.hasOwnProperty('error'))alert(json.error);
		else{
			alert(json.result);
		}
	},
	resultUpdated:function(json){
		if(json.hasOwnProperty('error'))alert(json.error);
		else{
			
		}
	},
	
	pageDivArray:function(divArray){
		var maxPerPage = 3;
		var pageArray = new Array();
		var thisPage = document.createElement("div");
		thisPage.className="surveyPage";
		var nOnThisPage = 0;
		for(var i=0;i<divArray.length;i++){
			var div = divArray[i];
			this.listenForHeightChange(div);
			
			thisPage.appendChild(div);
			var h= thisPage.offsetHeight;
			nOnThisPage++;
			if(nOnThisPage==maxPerPage||i==divArray.length-1){
				pageArray.push(thisPage);
				thisPage = document.createElement("div");
				nOnThisPage=0;
			}
		}
		return pageArray;
	},
	
	
	addPagesToSwipey:function(){
		var pa = this.pageArray;
		var list = document.createElement("ol");
		list.id = "swipeylist";
		for(var i=0;i<pa.length;i++){
			var page = pa[i];
			var li = document.createElement("li");
			li.appendChild(page);
			list.appendChild(li);
		}
		var divname = this.surveyDivName.replace('#','');
		var sdiv = document.getElementById(divname);
		sdiv.appendChild(list);
		
		
		swipey.initSwipey(divname,"swipeylist");
		
	},
	
	
	
	

};
function removeChildrenFromNode(node)
{
   if(node == undefined ||
        node == null)
   {
      return;
   }

   var len = node.childNodes.length;

	while (node.hasChildNodes())
	{
	  node.removeChild(node.firstChild);
	}
}
var isEven = function(someNumber){
    return (someNumber%2 == 0) ? true : false;
};