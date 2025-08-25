package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import db_config.GetConnection;
import model.DeliveryLog;
import model.DeliveryPartner;
import operation.DeliveryOperations;

public class DeliveryImplementor implements DeliveryOperations {

    @Override
    public List<DeliveryLog> getDeliveriesByPartner(int deliveryPartnerId) {
        List<DeliveryLog> deliveries = new ArrayList<>();
        String query = "SELECT dl.*, o.order_date, o.total_amount FROM delivery_log dl " +
                       "JOIN orders o ON dl.order_id = o.order_id " +
                       "WHERE dl.delivery_partner_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, deliveryPartnerId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                DeliveryLog dl = new DeliveryLog();
                dl.setDeliveryId(rs.getInt("delivery_id"));
                dl.setOrderId(rs.getInt("order_id"));
                dl.setVendorId(rs.getInt("vendor_id"));
                int dpId = rs.getInt("delivery_partner_id");
                if (rs.wasNull()) dpId = -1;
                dl.setDeliveryPartnerId(dpId == -1 ? null : dpId);
                dl.setStatus(rs.getString("status"));
                dl.setDeliveredOn(rs.getTimestamp("delivered_on"));
                dl.setConfirmedByVendor(rs.getBoolean("confirmed_by_vendor"));
                deliveries.add(dl);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return deliveries;
    }

    @Override
    public boolean assignDelivery(int orderId, int deliveryPartnerId) {
        String call = "{CALL sp_assign_delivery(?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, orderId);
            cs.setInt(2, deliveryPartnerId);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();
            String status = cs.getString(3);
            return status != null && status.toLowerCase().contains("success");
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateDeliveryStatus(int deliveryId, String status, Date deliveredOn, boolean confirmedByVendor) {
        String call = "{CALL sp_update_delivery_status(?, ?, ?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, deliveryId);
            cs.setString(2, status);
            if (deliveredOn != null) {
                cs.setTimestamp(3, new Timestamp(deliveredOn.getTime()));
            } else {
                cs.setTimestamp(3, null);
            }
            cs.setBoolean(4, confirmedByVendor);
            cs.registerOutParameter(5, Types.VARCHAR);
            cs.execute();
            String statusMsg = cs.getString(5);
            return statusMsg != null && statusMsg.toLowerCase().contains("updated");
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
