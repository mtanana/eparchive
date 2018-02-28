

ep={
	currServer: "/epnew",
	currFile: "/user/functions.jsp",
	loginFile: "/bypass/login2.jsp",
	
	waitingForRedirect:false,
	waitingToRedirectToUrl: "",
	
	timerDelay: 20000,
	
	authenticated: false,
	userData: null,
	
	onAuth:function(){},
	onDeAuth:function(){},
	//this will only be run once and then set back to null on userDataReady
	userDataReadyFunction:null,
	
	lastError:"",
	
	
	redirectToSubDir:function(dir){
		window.location=this.currServer+dir;
	},
	
	getUrl:function(){
		return this.currServer+this.currFile;
	},
	getLoginUrl:function(){
		return this.currServer+this.loginFile;
	},
	
	
	startLoginChecker:function(){
		setInterval(function(){ep.updateUserData(null)},ep.timerDelay);
	},
	
	
	//the onComplete(data) is a function to receive the json data
	//the onComplete function is called within the context from the parameter
	getFunctionAsObject:function( functionid,params, onComplete, context) {
		if (this.authenticated) {
			params["function"] = functionid;
			var thisurl = ep.getUrl();
			$.ajax({
				type : "POST",
				url : thisurl, //Requesting simple.xml
				dataType : "xml", //Make sure that you specify the type of file you expecting (XML)
				data : params,
				context:context,
				complete : function(data) {
					
					var json = $.xml2json(data.responseXML);
					
					onComplete.call(this,json);
				},
				error : ep.errorFunction
			});
		}else{
			alert("Waiting to authenticate");
		}
	},
    //the onComplete(data) is a function to receive the json data
	//the onComplete function is called within the context from the parameter
	//this function receives JSON instead of xml
	getFunctionAsObjectJSON:function( functionid,params, onComplete, context) {
		if (this.authenticated) {
			params["function"] = functionid;
			params["json"] = true;
			var thisurl = ep.getUrl();
			$.ajax({
				type : "POST",
				url : thisurl, //Requesting simple.xml
				dataType : "json", //Make sure that you specify the type of file you expecting (XML)
				data : params,
				context:context,
				success : function(data,textStatus,jqXHR) {
					
					var json = data;
					
					onComplete.call(this,json);
				},
				error : ep.errorFunction
			});
		}else{
			alert("Waiting to authenticate");
		}
	},
	
	login: function(user,pass){
		var params = {username: user,password: pass};
		this.updateUserData(params);
	},
	logout: function(){
		var params = {logout:true};
		this.updateUserData(params);
	},
	goToProgram:function(program){
		if(program.hasOwnProperty("pid")){
			this.waitingForRedirect=true;
			this.waitingToRedirectToUrl=program.url;
			this.changeProgram(program.pid,program.role);
		}else if(program.hasOwnProperty("groupid")){
			this.waitingForRedirect=true;
			this.waitingToRedirectToUrl=program.url;
			this.changeProgram(program.gid,program.role);
		}
	},
	changeProgram:function(pid,role){
		var params = {};
		params["setrole"]=role;
		params["setprogram"]=pid;
		this.updateUserData(params);
	},
	updateUserData:function(params) {
		if(params==null)params={};
		params["noredirect"]=true;
		var thisurl = ep.getLoginUrl();
		$.ajax({
			type : "POST",
			url : thisurl, //Requesting simple.xml
			dataType : "xml", //Make sure that you specify the type of file you expecting (XML)
			data: params,
			complete : function(data) {
				var json = $.xml2json(data.responseXML);
				ep.userDataReady(json);
			},
			error: ep.userErrorFunction
		});
	},
	

	
	userDataReady:function(data) {

		if (this.authenticated == false) {

			if (data.id == "null") {
				this.authenticated = false;
				this.userData = null;
				epui.popUpLogin();
			} else {
				this.authenticated = true;
				this.userData = data;
				epui.closePopUpLogin();
				this.onAuth();
			}
		} else {

			if (data.id == "null") {
				this.authenticated = false;
				this.userData = null;
				epui.popUpLogin();
				this.onDeAuth();
			} else {
				this.authenticated = true;
				this.userData = data;
			}
		}
		epui.updateUserBox();
		if(ep.waitingForRedirect)ep.redirectToSubDir(ep.waitingToRedirectToUrl);
		if(this.userDataReadyFunction!=null){
			this.userDataReadyFunction();
			this.userDataReadyFunction=null;
		}
			
	},
	
	errorFunction:function(jqXHR, textStatus, errorThrown){
		alert(errorThrown);
	},

	userErrorFunction:function(jqXHR, textStatus, errorThrown){
		
	}
	
	
	
}



epui={
	updateUserBox:function(){
		var htmlData = "";
		var user = ep.userData;
		if(ep.authenticated){
			htmlData+=user.username;
			htmlData+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			htmlData+="<a href='/epnew/bypass/login2.jsp?logout=true' id='logout'>Logout</a>";
		}else{
			htmlData+="Logged Out";
		}
		$("#userBox").html(htmlData);
		$("#logout").click(function(event){
			ep.logout();
			event.preventDefault();
		});
	},
	


	doLogin:function(){
		var uname = $("#username").val(); 
		var pass = $("#password").val(); 
		this.closePopUpLogin();
		ep.login(uname,pass);
		
	},
	
	popUpLogin:function(){
		var mask = $("#dialog-mask");
        if (!mask.is(":visible")) mask.fadeIn("fast");
		 var loginBox = $("#login_box");
        if (!loginBox.is(":visible")) loginBox.fadeIn("fast");
        
        
        $("#dologin").click(function(){
        	epui.doLogin();
        });
       
		$("#username").focus();
		$("#password").keyup(function(e) {
			if (e.keyCode == 13) {
				epui.doLogin();
			}
		});

	},
	closePopUpLogin:function(){
		var loginBox = $("#login_box");
		var pass =  $("#password");
		pass.val('');
        if (loginBox.is(":visible")) loginBox.fadeOut("fast");
       	var mask = $("#dialog-mask");
        if (mask.is(":visible"))mask.fadeOut("fast");
	},
	
	putProgramList:function(divName,programSelectedFunction){
		var programs = getObjectAsArray(ep.userData.user.programaccess.program);
		var programgroups = getObjectAsArray(ep.userData.user.programaccess.programgroups);
		var div = $(divName);
		div.empty();
		div.append("<h3>Select a Program</h3>");
		var table = document.createElement("table");
		div.append(table);
		for(var i=0;i<programs.length;i++){
			var program = programs[i];
			var row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			var a = document.createElement("a");
			a.innerHTML = program.pname;
			a.data = program;
			a.onclick = programSelectedFunction;
			
			cell.appendChild(a);
			var cell2 = row.insertCell(-1);
			var span = document.createElement("span");
			span.innerHTML=epui.convertRoleToString(program.role);
			cell2.appendChild(span);
			
			
		}
		div.append(table);
		
		
	},
	
	putSurveyList:function(divName,surveySelectFunction){
		var grants= getObjectAsArray(ep.userData.user.grant);
		var surveyresults = getObjectAsArray(ep.userData.user.surveyresults.surveyresult);
		var inprogress = new Array();
		for(var i=0;i<surveyresults.length;i++){
			var sr = surveyresults[i];
			if(sr.finished=="false")inprogress.push(sr);
		}
		var div = $(divName);
		div.empty();
		div.append("<h3>Select a Survey</h3>");
		var table = document.createElement("table");
		div.append(table);
		for(var i=0;i<grants.length;i++){
			var grant = grants[i];
			var row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			var a = document.createElement("a");
			a.innerHTML = grant.grantname;
			a.data = grant;
			a.onclick =surveySelectFunction;
			cell.appendChild(a);
						
			
		}
		div.append(table);
		//surveys in progress
		if(inprogress.length>0){

			div.append("<h3>Select A Survey In Progress</h3>");

			table = document.createElement("table");
			div.append(table);
			for (var i = 0; i < inprogress.length; i++) {
				var sr = inprogress[i];
				var row = table.insertRow(-1);
				var cell = row.insertCell(-1);
				var a = document.createElement("a");
				a.innerHTML = sr.surveyname;
				a.data = sr;
				a.onclick = surveySelectFunction;
				cell.appendChild(a);

			}
			div.append(table);

			
		}
	
	},
	
	convertRoleToString:function(role){
		if(role=="super")return "Superuser";
		else if(role=="admin")return "Program Administrator";
		else if(role=="user")return "User";
		else return "";
	}





	
}





//this is a useful function for objects
Object.prototype.hasOwnProperty = function(property) {
    return this[property] !== undefined;
};

//returns property as array regardless of whether it is one.
function getObjectAsArray(property) {
	var array = new Array();
	if(property!=null){
		if(property instanceof Array) return property;
		else{
			array.push(property);
			return array;
		} 
	}
	
    return array;
};

function EpPopUp(){
	this.popUp = null;
	this.innerElement=document.createElement('div');
	this.titleText="";
	
	this.closeMe = function(){
		$.modaldialog.hide();
	};
	this.showMe=function(){
		this.popUp=$.modaldialog.prompt(innerElement,{
  			title: this.titleText
  		});
	};
	
}

/*
 * jQuery Modal Dialog plugin 1.0
 * Released: July 14, 2008
 * 
 * Copyright (c) 2008 Chris Winberry
 * Email: transistech@gmail.com
 * 
 * Original Design: Michael Leigeber
 * http://www.leigeber.com/2008/04/custom-javascript-dialog-boxes/
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @license http://www.opensource.org/licenses/mit-license.php
 * @license http://www.gnu.org/licenses/gpl.html
 * @project jquery.modaldialog
 */
(function($) {
	var modaldialog = { };

	// Creates and shows the modal dialog
	function showDialog (msg, options) {
		// Make sure the dialog type is valid. If not assign the default one (the first)
		if(!$.inArray(options.type, modaldialog.DialogTypes)) {
			options.type = modaldialog.DialogTypes[0];
		};

		// Merge default title (per type), default settings, and user defined settings
		var settings = $.extend({ title: modaldialog.DialogTitles[options.type] }, modaldialog.defaults, options);

		// If there's no timeout, make sure the close button is show (or the dialog can't close)
		settings.timeout = (typeof(settings.timeout) == "undefined") ? 0 : settings.timeout;
		settings.showClose = ((typeof(settings.showClose) == "undefined") | !settings.timeout) ? true : !!settings.showClose;

		// Check if the dialog elements exist and create them if not
		if (!document.getElementById('dialog')) {
			dialog = document.createElement('div');
			dialog.id = 'dialog';
			$(dialog).html(
				"<div id='dialog-header'>" +
					"<div id='dialog-title'></div>" +
					"<div id='dialog-close'></div>" +
				"</div>" +
				"<div id='dialog-content'>" +
					"<div id='dialog-content-inner' />" +
					"<div id='dialog-button-container'>" +
						"<input type='button' id='dialog-button' value='Close'>" +
					"</div>" +
				"</div>"
				);
			
			dialogmask = document.createElement('div');
			dialogmask.id = 'dialog-mask';
			
			$(dialogmask).hide();
			$(dialog).hide();
			
			document.body.appendChild(dialogmask);
			document.body.appendChild(dialog);

			// Set the click event for the "x" and "Close" buttons			
			$("#dialog-close").click(modaldialog.hide);
			$("#dialog-button").click(modaldialog.hide);
		}

		var dl = $('#dialog');
		var dlh = $('#dialog-header');
		var dlc = $('#dialog-content');
		var dlb = $('#dialog-button');

		$('#dialog-title').html(settings.title);
		$('#dialog-content-inner').html(msg);

		// Center the dialog in the window but make sure it's at least 25 pixels from the top
		// Without that check, dialogs that are taller than the visible window risk
		// having the close buttons off-screen, rendering the dialog unclosable 
		dl.css('width', settings.width);
		var dialogTop = Math.abs($(window).height() - dl.height()) / 2;
		dl.css('left', ($(window).width() - dl.width()) / 2);
		dl.css('top', (dialogTop >= 25) ? dialogTop : 25);

		// Clear the dialog-type classes and add the current dialog-type class		
		$.each(modaldialog.DialogTypes, function () { dlh.removeClass(this + "header") });
		dlh.addClass(settings.type + "header")
		$.each(modaldialog.DialogTypes, function () { dlc.removeClass(this) });
		dlc.addClass(settings.type);
		$.each(modaldialog.DialogTypes, function () { dlb.removeClass(this + "button") });
		dlb.addClass(settings.type + "button")

		if (!settings.showClose) {
			$('#dialog-close').hide();
			$('#dialog-button-container').hide();
		} else {
			$('#dialog-close').show();
			$('#dialog-button-container').show();
		}

		if (settings.timeout) {
			window.setTimeout("$('#dialog').fadeOut('slow', 0); $('#dialog-mask').fadeOut('normal', 0);", (settings.timeout * 1000));
		}
		
		dl.fadeIn("slow");
		$('#dialog-mask').fadeIn("normal");
	};

	//this adds the element and returns the object
    function showDialogReturnObject (element, options) {
		

		// Merge default title (per type), default settings, and user defined settings
		var settings = $.extend({ title: options.title }, modaldialog.defaults, options);

		// If there's no timeout, make sure the close button is show (or the dialog can't close)
		settings.timeout = (typeof(settings.timeout) == "undefined") ? 0 : settings.timeout;
		settings.showClose = ((typeof(settings.showClose) == "undefined") | !settings.timeout) ? true : !!settings.showClose;

		// Check if the dialog elements exist and create them if not
		if (!document.getElementById('dialog')) {
			dialog = document.createElement('div');
			dialog.id = 'dialog';
			$(dialog).html(
				"<div id='dialog-header'>" +
					"<div id='dialog-title'></div>" +
					"<div id='dialog-close'></div>" +
				"</div>" +
				"<div id='dialog-content'>" +
					"<div id='dialog-content-inner' />" +
					"<div id='dialog-button-container'>" +
						"<input type='button' id='dialog-button' value='Close'>" +
					"</div>" +
				"</div>"
				);
			
			dialogmask = document.createElement('div');
			dialogmask.id = 'dialog-mask';
			
			$(dialogmask).hide();
			$(dialog).hide();
			
			document.body.appendChild(dialogmask);
			document.body.appendChild(dialog);

			// Set the click event for the "x" and "Close" buttons			
			$("#dialog-close").click(modaldialog.hide);
			$("#dialog-button").click(modaldialog.hide);
		}

		var dl = $('#dialog');
		var dlh = $('#dialog-header');
		var dlc = $('#dialog-content');
		var dlb = $('#dialog-button');
		
		$('#dialog-title').html(settings.title);
		var dlcinner = $('#dialog-content-inner').html(msg);

		// Center the dialog in the window but make sure it's at least 25 pixels from the top
		// Without that check, dialogs that are taller than the visible window risk
		// having the close buttons off-screen, rendering the dialog unclosable 
		dl.css('width', settings.width);
		var dialogTop = Math.abs($(window).height() - dl.height()) / 2;
		dl.css('left', ($(window).width() - dl.width()) / 2);
		dl.css('top', (dialogTop >= 25) ? dialogTop : 25);

		// Clear the dialog-type classes and add the current dialog-type class		
		$.each(modaldialog.DialogTypes, function () { dlh.removeClass(this + "header") });
		dlh.addClass(settings.type + "header")
		$.each(modaldialog.DialogTypes, function () { dlc.removeClass(this) });
		dlc.addClass(settings.type);
		$.each(modaldialog.DialogTypes, function () { dlb.removeClass(this + "button") });
		dlb.addClass(settings.type + "button")

		if (!settings.showClose) {
			$('#dialog-close').hide();
			$('#dialog-button-container').hide();
		} else {
			$('#dialog-close').show();
			$('#dialog-button-container').show();
		}

		if (settings.timeout) {
			window.setTimeout("$('#dialog').fadeOut('slow', 0); $('#dialog-mask').fadeOut('normal', 0);", (settings.timeout * 1000));
		}
		
		dl.fadeIn("slow");
		$('#dialog-mask').fadeIn("normal");
		return dlcinner;
		
	};
	modaldialog.error = function $$modaldialog$error (msg, options) {
		if (typeof(options) == "undefined") {
			options = { };
		}
		options['type'] = "error";
		return(showDialog(msg, options));
	}
	modaldialog.warning = function $$modaldialog$error (msg, options) {
		if (typeof(options) == "undefined") {
			options = { };
		}
		options['type'] = "warning";
		return(showDialog(msg, options));
	}
	modaldialog.success = function $$modaldialog$error (msg, options) {
		if (typeof(options) == "undefined") {
			options = { };
		}
		options['type'] = "success";
		return(showDialog(msg, options));
	}
	modaldialog.prompt = function $$modaldialog$error (msg, options) {
		if (typeof(options) == "undefined") {
			options = { };
		}
		options['type'] = "prompt";
		return(showDialog(msg, options));
	}

	modaldialog.hide = function $$modaldialog$hide () {
		$('#dialog').fadeOut("slow", function () { $(this).hide(0); });
		$('#dialog-mask').fadeOut("normal", function () { $(this).hide(0); });
	};

	modaldialog.DialogTypes = new Array("error", "warning", "success", "prompt");
	modaldialog.DialogTitles = {
		"error": "!! Error !!"
		, "warning": "Warning!"
		, "success": "Success"
		, "prompt": "Please Choose"
	};

	modaldialog.defaults = {
		timeout: 0
		, showClose: true
		, width: 525
	};

	$.extend({ modaldialog: modaldialog });
})(jQuery);




