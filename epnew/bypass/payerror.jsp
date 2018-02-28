<%@ page contentType="text/html; charset=utf-8" language="java" import="java.sql.*" errorPage="" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Evaluation Portal: Payment Success</title>



<style type="text/css">
.MainBody {
	font-family: Times New Roman, Times, serif;
}
.MainLink {
	color: #9ba2af;
}
.MainTitle {
	color: #9ba2af;
}
.MainTitle strong {
	font-family: "Times New Roman", Times, serif;
}
</style>
</head>

<body>
<p><img src="ep.png" width="482" height="76" /></p>
<table width="736" height="215" border="0">
  <tr>
    <td width="60" class="MainTitle"><strong> <img src="amazonsmall.jpg" width="37" height="23" /></strong></td>
    <td width="666" class="MainTitle"><strong>Status: Error</strong></td>
  </tr>
  <tr>
    <td colspan="2"><p class="MainBody">Something appears to have gone wrong with the payment process. </p>
      <p class="MainBody">If you would like to go back to try again, click here:</p>
    <p><a href="./login.jsp?logout=true" class="MainLink">Evaluation Portal Login</a></p>
    <p>If you continue to have problems, please contact the admin.</p></td>
  </tr>
</table>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</body>
</html>