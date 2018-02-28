<?xml version="1.0" encoding="ISO-8859-1" ?>
<%

response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
response.setContentType("text/xml");
%>
<%@ page import="org.epc.users.*" %>
<%@ page import="java.sql.SQLException" %>

<%

//This specifies which function we would like to perform
//1 is get all users
//2 will add a user
//3 will add a user to a program
//4 will remove a user from a program
//5 will get only active users
//6 will activate a user
//7 will deactivate a user
//8 will get programs and roles for a single user
//9 will change the password for a user
//10 will update user info
//11 will get all users for a given program
//12 will create a user in this program
//13 is get users for THIS program (by session)

int funct 	= -99;

funct = Integer.parseInt(request.getParameter("function"));


String outXML = "";

UserFunctions uf = new UserFunctions();

User user = (User) session.getAttribute("user");

try{
if(user!=null){
	if (funct==1009){
		//don't need to escape pword b/c of encryption
		Long uid = user.uid;
		String pword = request.getParameter("pword");
		uf.initConn();
		int r = uf.changeUserPassword(uid,pword);
		uf.closeConn();
		
		if(r>=1)outXML += "<root><result>Success</result></root>";
		else outXML += "<root><error>No Records Updated</error></root>";
		
	}else if (funct==1010){
		//these don't need to be escaped b/c they are later encrypted
		Long uid = user.uid;
		String  fname =	request.getParameter("fname");
		String  lname =	request.getParameter("lname");
		String  email =	request.getParameter("email");
		
		uf.initConn();
		int r = uf.updateUserInfo(uid,fname,lname,email);
		uf.closeConn();
		
		if(r>=1)outXML += "<root><result>Success</result></root>";
		else outXML += "<root><error>No Records Updated</error></root>";
		
	}
		
	else{
		outXML+= "<root><error>No function specified</error></root>";
	}

}

} catch (SQLException e) {
			// TODO Auto-generated catch block
			outXML+= "<root><error>"+e.getLocalizedMessage()+"</error></root>";
}





%>

<%=outXML%>