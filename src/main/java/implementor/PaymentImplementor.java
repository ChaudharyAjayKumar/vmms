package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import db_config.GetConnection;
import model.Payment;
import operation.PaymentOperations;

public class PaymentImplementor implements PaymentOperations {

    @Override
    public boolean makePayment(int vendorId, int orderId, double amount, String mode, Timestamp paymentDate) {
        String call = "{CALL sp_make_payment(?, ?, ?, ?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
             
            cs.setInt(1, vendorId);
            cs.setInt(2, orderId);
            cs.setDouble(3, amount);
            cs.setString(4, mode); // Should be 'Cash' or 'UPI'
            cs.setTimestamp(5, paymentDate);
            cs.registerOutParameter(6, Types.VARCHAR);
            
            cs.execute();
            
            String status = cs.getString(6);
            return status != null && status.toLowerCase().contains("success");
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Payment> getPaymentsByVendor(int vendorId) {
        List<Payment> payments = new ArrayList<>();
        String query = "SELECT * FROM payments WHERE vendor_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
             
            ps.setInt(1, vendorId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                payments.add(mapPayment(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return payments;
    }

    @Override
    public double calculateDueAmount(int vendorId) {
        double dueAmount = 0.0;
        String query = "SELECT due_amount FROM vendors WHERE vendor_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
             
            ps.setInt(1, vendorId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                dueAmount = rs.getDouble("due_amount");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return dueAmount;
    }

    private Payment mapPayment(ResultSet rs) throws SQLException {
        Payment p = new Payment();
        p.setPaymentId(rs.getInt("payment_id"));
        p.setVendorId(rs.getInt("vendor_id"));
        p.setOrderId(rs.getInt("order_id"));
        p.setAmountPaid(rs.getDouble("amount_paid"));
        p.setMode(rs.getString("mode"));
        p.setPaidOn(rs.getTimestamp("paid_on"));
        return p;
    }
}
