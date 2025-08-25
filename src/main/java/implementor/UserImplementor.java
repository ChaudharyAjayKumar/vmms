package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.User;
import operation.UserOperations;
import db_config.GetConnection;

public class UserImplementor implements UserOperations {

    @Override
    public User getUserById(int userId) {
        User user = null;
        String query = "SELECT * FROM users WHERE user_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                user = mapUser(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    @Override
    public User getUserByUsername(String username) {
        User user = null;
        String query = "SELECT * FROM users WHERE username = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                user = mapUser(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    @Override
    public List<User> getAllUsersByRole(String role) {
        List<User> users = new ArrayList<>();
        String query = "SELECT * FROM users WHERE role = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setString(1, role);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                users.add(mapUser(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }

    @Override
    public boolean registerUser(User user) {
        // Calls stored procedure sp_register_user
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall("{CALL sp_register_user(?, ?, ?, ?, ?)}")) {
            cs.setString(1, user.getUsername());
            cs.setString(2, user.getPasswordHash());
            cs.setString(3, user.getRole());
            cs.registerOutParameter(4, Types.INTEGER); // p_user_id
            cs.registerOutParameter(5, Types.VARCHAR); // p_status
            cs.execute();
            String status = cs.getString(5);
            return "Registration successful".equalsIgnoreCase(status);
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateUser(User user) {
        // Calls stored procedure sp_update_user_profile
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall("{CALL sp_update_user_profile(?, ?, ?, ?)}")) {
            
            cs.setInt(1, user.getUserId());
            
            // Set password hash; can be null or empty if no update needed
            if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
                cs.setNull(2, java.sql.Types.VARCHAR);
            } else {
                cs.setString(2, user.getPasswordHash());
            }
            
            // Pass actual contact information from user object instead of null
            cs.setString(3, user.getContact());
            
            cs.registerOutParameter(4, java.sql.Types.VARCHAR); // p_status
            
            cs.execute();
            
            String status = cs.getString(4);
            return "Profile updated".equalsIgnoreCase(status);
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }


    @Override
    public boolean deleteUser(int userId) {
        String query = "DELETE FROM users WHERE user_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public String getUserRole(int userId) {
        String role = null;
        String query = "SELECT role FROM users WHERE user_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                role = rs.getString("role");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return role;
    }

    @Override
    public boolean validateLogin(String username, String passwordHash) {
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall("{CALL sp_login_user(?, ?, ?, ?, ?)}")) {
            cs.setString(1, username);
            cs.setString(2, passwordHash);
            cs.registerOutParameter(3, Types.INTEGER); // p_user_id
            cs.registerOutParameter(4, Types.VARCHAR); // p_role
            cs.registerOutParameter(5, Types.VARCHAR); // p_status
            cs.execute();
            String status = cs.getString(5);
            return "Login successful".equalsIgnoreCase(status);
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private String getUserContact(int userId, String role, Connection con) throws SQLException {
        String sql = null;
        switch (role) {
            case "Vendor":
                sql = "SELECT contact FROM vendors WHERE user_id = ?";
                break;
            case "Admin":
                sql = "SELECT contact FROM middleware_admins WHERE user_id = ?";
                break;
            case "DeliveryPartner":
                sql = "SELECT contact FROM delivery_partners WHERE user_id = ?";
                break;
        }
        if (sql != null) {
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setInt(1, userId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return rs.getString("contact");
                }
            }
        }
        return null;
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User u = new User();
        u.setUserId(rs.getInt("user_id"));
        u.setUsername(rs.getString("username"));
        u.setPasswordHash(rs.getString("password_hash"));
        u.setRole(rs.getString("role"));
        u.setLastLogin(rs.getTimestamp("last_login"));

        // Fetch contact from respective table
        String contact = getUserContact(u.getUserId(), u.getRole(), rs.getStatement().getConnection());
        u.setContact(contact);

        return u;
    }

}
