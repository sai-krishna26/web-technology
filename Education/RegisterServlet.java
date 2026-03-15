import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;

public class RegisterServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String age = request.getParameter("age");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String gender = request.getParameter("gender");

        try{

            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection con = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/registration_db","root","");

            String sql = "INSERT INTO users(name,age,email,phone,gender) VALUES(?,?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1,name);
            ps.setInt(2,Integer.parseInt(age));
            ps.setString(3,email);
            ps.setString(4,phone);
            ps.setString(5,gender);

            ps.executeUpdate();

            response.getWriter().println("Registration Successful");

            con.close();

        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
}