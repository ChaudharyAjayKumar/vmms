package implementor;

import java.sql.*;
import com.mysql.cj.jdbc.exceptions.MysqlDataTruncation;
import db_config.GetConnection;
import model.LanguageSetting;
import operation.LanguageOperations;

public class LanguageImplementor implements LanguageOperations {

    @Override
    public String getLanguagePreference(int userId) {
        String language = "en"; // default language
        String query = "SELECT selected_language FROM language_settings WHERE user_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                language = rs.getString("selected_language");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return language;
    }

    @Override
    public boolean setLanguagePreference(int userId, String languageCode) {
        String call = "{CALL sp_set_language(?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, userId);
            cs.setString(2, languageCode);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();
            String status = cs.getString(3);
            return status != null && status.toLowerCase().contains("success");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
