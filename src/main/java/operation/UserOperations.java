package operation;

import java.util.List;
import model.User;

public interface UserOperations {
    User getUserById(int userId);
    User getUserByUsername(String username);
    List<User> getAllUsersByRole(String role);
    boolean registerUser(User user);
    boolean updateUser(User user);
    boolean deleteUser(int userId);
    String getUserRole(int userId);
    boolean validateLogin(String username, String passwordHash);
}
