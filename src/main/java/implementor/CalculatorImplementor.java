package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import db_config.GetConnection;
import model.CalculatorHistory;
import operation.CalculatorOperations;

public class CalculatorImplementor implements CalculatorOperations {

    @Override
    public boolean addCalculatorEntry(int userId, String mode, String inputExpression, String result) {
        String call = "{CALL sp_add_calculator_entry(?, ?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, userId);
            cs.setString(2, mode);
            cs.setString(3, inputExpression);
            cs.setString(4, result);
            cs.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CalculatorHistory> getCalculatorHistory(int userId) {
        List<CalculatorHistory> historyList = new ArrayList<>();
        String call = "{CALL sp_get_calculator_history(?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, userId);
            ResultSet rs = cs.executeQuery();
            while (rs.next()) {
                CalculatorHistory entry = new CalculatorHistory();
                entry.setCalcId(rs.getInt("calc_id"));
                entry.setUserId(rs.getInt("user_id"));
                entry.setMode(rs.getString("mode"));
                entry.setInputExpression(rs.getString("input_expression"));
                entry.setResult(rs.getString("result"));
                entry.setTimestamp(rs.getTimestamp("timestamp"));
                historyList.add(entry);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return historyList;
    }
}
