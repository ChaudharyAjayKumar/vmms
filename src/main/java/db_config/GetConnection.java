package db_config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class GetConnection {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/vmms_db?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";               // Update as needed
    private static final String DB_PASSWORD = "ajay2018";       // Update as needed

    // Load the JDBC Driver in static block once per class loading
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found.");
            e.printStackTrace();
        }
    }

    /**
     * Returns a new database connection.
     * Caller should close connection when done.
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASSWORD);
    }
}
