package model;

import java.util.Date;

public class DeliveryLog {
    private int deliveryId;
    private int orderId;
    private int vendorId;
    private Integer deliveryPartnerId;  // nullable
    private String status;               // "Pending", "Delivered", "Failed"
    private Date deliveredOn;
    private boolean confirmedByVendor;

    // Getters & Setters
    public int getDeliveryId() { return deliveryId; }
    public void setDeliveryId(int id) { this.deliveryId = id; }
    public int getOrderId() { return orderId; }
    public void setOrderId(int id) { this.orderId = id; }
    public int getVendorId() { return vendorId; }
    public void setVendorId(int id) { this.vendorId = id; }
    public Integer getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(Integer id) { this.deliveryPartnerId = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Date getDeliveredOn() { return deliveredOn; }
    public void setDeliveredOn(Date deliveredOn) { this.deliveredOn = deliveredOn; }
    public boolean isConfirmedByVendor() { return confirmedByVendor; }
    public void setConfirmedByVendor(boolean confirmedByVendor) { this.confirmedByVendor = confirmedByVendor; }
}
