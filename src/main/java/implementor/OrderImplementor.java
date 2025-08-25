package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import db_config.GetConnection;
import model.Order;
import model.OrderItem;
import operation.OrderOperations;

public class OrderImplementor implements OrderOperations {

    @Override
    public List<Order> getOrdersByVendor(int vendorId) {
        List<Order> orders = new ArrayList<>();
        String query = "SELECT * FROM orders WHERE vendor_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, vendorId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    orders.add(mapOrder(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    @Override
    public Order getOrderDetails(int orderId) {
        Order order = null;
        String query = "SELECT * FROM orders WHERE order_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    order = mapOrder(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return order;
    }

    @Override
    public boolean placeOrder(int vendorId, List<OrderItem> items) {
        boolean success = false;
        String callProcedure = "{CALL sp_place_order(?, ?, ?)}"; // vendorId, out orderId, out status
        
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(callProcedure)) {
            
            cs.setInt(1, vendorId);
            cs.registerOutParameter(2, Types.INTEGER); // orderId
            cs.registerOutParameter(3, Types.VARCHAR); // status
            
            cs.execute();
            
            int orderId = cs.getInt(2);
            String status = cs.getString(3);
            
            if (!"Order placed successfully".equalsIgnoreCase(status)) {
                return false;
            }
            
            // Insert order items after order header creation in stored procedure
            // Since sp_place_order sub-handles cart, if direct insert is needed, implement separately
            
            success = true;
            
        } catch (SQLException e) {
            e.printStackTrace();
            success = false;
        }
        return success;
    }

    @Override
    public boolean updateOrderStatus(int orderId, String status) {
        String query = "UPDATE orders SET status = ? WHERE order_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setString(1, status);
            ps.setInt(2, orderId);
            int affected = ps.executeUpdate();
            return affected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public double calculateOrderTotal(int orderId) {
        double total = 0;
        String query = "SELECT IFNULL(SUM(qty * price), 0) AS total FROM order_items WHERE order_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    total = rs.getDouble("total");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return total;
    }

    private Order mapOrder(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setOrderId(rs.getInt("order_id"));
        o.setVendorId(rs.getInt("vendor_id"));
        o.setOrderDate(rs.getTimestamp("order_date"));
        o.setStatus(rs.getString("status"));
        o.setTotalAmount(rs.getDouble("total_amount"));
        return o;
    }
}
