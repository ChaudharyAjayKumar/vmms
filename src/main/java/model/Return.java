package model;

import java.util.Date;

public class Return {
    private int returnId;
    private int orderId;        // FK
    private Date returnDate;
    private String returnStatus;  // "Pending", "Approved", "Rejected"
    private String overallReason;

    // Getters & Setters
    public int getReturnId() { return returnId; }
    public void setReturnId(int returnId) { this.returnId = returnId; }
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public Date getReturnDate() { return returnDate; }
    public void setReturnDate(Date returnDate) { this.returnDate = returnDate; }
    public String getReturnStatus() { return returnStatus; }
    public void setReturnStatus(String returnStatus) { this.returnStatus = returnStatus; }
    public String getOverallReason() { return overallReason; }
    public void setOverallReason(String overallReason) { this.overallReason = overallReason; }
}
