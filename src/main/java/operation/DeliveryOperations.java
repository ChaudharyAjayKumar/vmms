package operation;

import java.util.List;
import model.DeliveryLog;

public interface DeliveryOperations {
    List<DeliveryLog> getDeliveriesByPartner(int deliveryPartnerId);
    boolean assignDelivery(int orderId, int deliveryPartnerId);
    boolean updateDeliveryStatus(int deliveryId, String status, java.util.Date deliveredOn, boolean confirmedByVendor);
}
