<%

response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>


<%@ page import="org.epc.users.*" %>
<%@ page import="org.epc.grants.*" %>
<%@ page import="org.epc.constants.Constants" %>


<%
		String temploginuser = (String) request.getParameter("temploginuser");
		if(temploginuser!=null){
			UserFunctions uf = new UserFunctions();
			uf.initConn();
			uf.sendTempLoginByEmail(temploginuser);
			uf.closeConn();
		}
		
		


	
		String strXML="";

		

		String sysmis = "-9999.0";

		
		strXML = "<items>";
		User user = (User) session.getAttribute("user");
		String username = (String) session.getAttribute("username");
		
        String program = (String) session.getAttribute("program");
		String programname = (String) session.getAttribute("programname");
		String groupname = (String) session.getAttribute("groupname");
		
		String parent = (String) session.getAttribute("parent");
		String role = (String) session.getAttribute("role");
		String error = (String) session.getAttribute("error");
		String id = (String) session.getAttribute("id");
		
		if(user!=null)strXML+=user.toXML();
	
		String district = (String) session.getAttribute("ssdistrict");
		String level = (String) session.getAttribute("sslevel");
		String forcehttps = (String)application.getInitParameter("forcehttps");
		Object currsrid = session.getAttribute("currentsrid");
		String currentsrid = "";
		if(currsrid!=null)currentsrid = currsrid.toString();
		
			strXML+="<username>"+username+"</username>";
			strXML+="<role>"+role+"</role>";
			strXML+="<id>"+id+"</id>";
			strXML+="<program>"+program+"</program>";
			strXML+="<programname>"+programname+"</programname>";
			strXML+="<groupname>"+groupname+"</groupname>";
			strXML+="<groupid>"+session.getAttribute("groupid")+"</groupid>";
			strXML+="<parent>"+parent+"</parent>";
			strXML+="<ssdistrict>"+district+"</ssdistrict>";
			strXML+="<sslevel>"+level+"</sslevel>";
			strXML+="<error>"+error+"</error>";
			strXML+="<forcehttps>"+forcehttps+"</forcehttps>";
			strXML+="<failedtries>"+session.getAttribute("failedtries")+"</failedtries>";
			strXML+="<hosturl>"+org.epc.constants.Constants.hostURL+"</hosturl>";
			strXML+="<currentsrid>"+currentsrid+"</currentsrid>";


			strXML +="</items>";

		response.setContentType("text/xml");
	
%>

<%=strXML%>