package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import db_config.GetConnection;
import model.Return;
import model.ReturnItem;
import operation.ReturnOperations;

public class ReturnImplementor implements ReturnOperations {

    @Override
    public List<Return> getReturnsByVendor(int vendorId) {
        List<Return> returns = new ArrayList<>();
        String query = "SELECT r.* FROM returns r JOIN orders o ON r.order_id = o.order_id WHERE o.vendor_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, vendorId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                returns.add(mapReturn(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return returns;
    }

    @Override
    public Return getReturnDetails(int returnId) {
        Return r = null;
        String query = "SELECT * FROM returns WHERE return_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, returnId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                r = mapReturn(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return r;
    }

    @Override
    public boolean raiseReturnRequest(int orderId, List<ReturnItem> items, String overallReason) {
        String call = "{CALL sp_raise_return_request(?, ?, ?, ?, ?)}";
        // Convert items to JSON string to pass to stored procedure
        String itemsJson = toJson(items);
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, orderId);
            cs.setString(2, itemsJson);
            cs.setString(3, overallReason);
            cs.registerOutParameter(4, Types.INTEGER); // out returnId
            cs.registerOutParameter(5, Types.VARCHAR); // out status
            cs.execute();
            String status = cs.getString(5);
            return status != null && status.toLowerCase().contains("success");
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean approveReturn(int returnId) {
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall("{CALL sp_approve_return(?, ?)}")) {
            cs.setInt(1, returnId);
            cs.registerOutParameter(2, Types.VARCHAR);
            cs.execute();
            String status = cs.getString(2);
            return status != null && status.toLowerCase().contains("approved");
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean rejectReturn(int returnId, String reason) {
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall("{CALL sp_reject_return(?, ?, ?)}")) {
            cs.setInt(1, returnId);
            cs.setString(2, reason);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();
            String status = cs.getString(3);
            return status != null && status.toLowerCase().contains("rejected");
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public double calculateReturnAmount(int returnId) {
        double amount = 0;
        String query = "SELECT fn_calculate_return_amount(?) AS total_amount";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, returnId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                amount = rs.getDouble("total_amount");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return amount;
    }

    @Override
    public List<Return> getPendingReturns() {
        List<Return> returns = new ArrayList<>();
        String call = "{CALL sp_get_pending_returns()}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            ResultSet rs = cs.executeQuery();
            while (rs.next()) {
                returns.add(mapReturn(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return returns;
    }

    private Return mapReturn(ResultSet rs) throws SQLException {
        Return ret = new Return();
        ret.setReturnId(rs.getInt("return_id"));
        ret.setOrderId(rs.getInt("order_id"));
        ret.setReturnDate(rs.getTimestamp("return_date"));
        ret.setReturnStatus(rs.getString("return_status"));
        ret.setOverallReason(rs.getString("overall_reason"));
        return ret;
    }

    private String toJson(List<ReturnItem> items) {
        // For simplicity, build JSON array string manually; better use a library like Jackson/Gson
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < items.size(); i++) {
            ReturnItem item = items.get(i);
            sb.append("{");
            sb.append("\"product_id\":").append(item.getProductId()).append(",");
            sb.append("\"qty\":").append(item.getQty()).append(",");
            sb.append("\"reason\":\"").append(item.getReason()).append("\"");
            sb.append("}");
            if (i < items.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
