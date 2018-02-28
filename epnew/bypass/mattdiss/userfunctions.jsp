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

uf.autoInitConn=false;

try{
if(funct==2){
	long pid1 = 260719;  //therapy training A
	long pid2=260720;   //Therapy Training B
	long selectedpid = -99;
	double d = Math.random();
	if(d>.5)selectedpid=pid1;
	else selectedpid=pid2;
		//these don't need to be escaped b/c they are later encrypted
		String  uname =	request.getParameter("uname");
		String  fname =	request.getParameter("fname");
		String  lname =	request.getParameter("lname");
		String  email =	request.getParameter("email");
		String  pword =	request.getParameter("pword");
		

		uf.initConn();
			
		long uid = uf.newUserWithinProgram(selectedpid,"user",uname, fname, lname, email, pword );
		
		if(uid==-99)outXML+= "<root><error>Sorry, that username exists already</error></root>";
		else{
			outXML += "<root><userid>"+uid+"</userid></root>";		
		}
		
		
		
		
		
		uf.closeConn();
		
	}
	else{
		outXML+= "<root><error>No function specified</error></root>";
	}

	

} catch (SQLException e) {
			// TODO Auto-generated catch block
			outXML+= "<root><error>"+e.getLocalizedMessage()+"</error></root>";
}





%>

<%=outXML%>