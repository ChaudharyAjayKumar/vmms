package operation;

import java.sql.Timestamp;
import java.util.List;

import model.Payment;

public interface PaymentOperations {
    boolean makePayment(int vendorId, int orderId, double amount, String mode, Timestamp paymentDate);
    List<Payment> getPaymentsByVendor(int vendorId);
    double calculateDueAmount(int vendorId);
}
