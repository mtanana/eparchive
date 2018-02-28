<%@ page import="org.epc.users.*" %>
<%  
 response.setDateHeader ("Expires", 0); //prevents caching at the proxy server

 String templogin = request.getParameter("templogin");
 String error = (String) session.getAttribute("error");

 User user = (User) session.getAttribute("user");
 
 if(templogin!=null&&user==null){
	 response.sendRedirect("./error.jsp");
 }else{
	 response.sendRedirect("./login.jsp");
 }
 
 
 %>