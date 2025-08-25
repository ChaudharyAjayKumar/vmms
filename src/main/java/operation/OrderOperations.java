package operation;

import java.util.List;
import model.Order;
import model.OrderItem;

public interface OrderOperations {
    List<Order> getOrdersByVendor(int vendorId);
    Order getOrderDetails(int orderId);
    boolean placeOrder(int vendorId, List<OrderItem> items);
    boolean updateOrderStatus(int orderId, String status);
    double calculateOrderTotal(int orderId);
}
