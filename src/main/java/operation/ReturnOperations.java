package operation;

import java.util.List;
import model.Return;
import model.ReturnItem;

public interface ReturnOperations {
    List<Return> getReturnsByVendor(int vendorId);
    Return getReturnDetails(int returnId);
    boolean raiseReturnRequest(int orderId, List<ReturnItem> items, String overallReason);
    boolean approveReturn(int returnId);
    boolean rejectReturn(int returnId, String reason);
    double calculateReturnAmount(int returnId);
    List<Return> getPendingReturns();
}
