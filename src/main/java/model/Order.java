package model;

import java.util.Date;

public class Order {
    private int orderId;
    private int vendorId;     // FK
    private Date orderDate;
    private String status;    // "Pending","Confirmed","Delivered"
    private double totalAmount;

    // Getters & Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int id) { this.orderId = id; }
    public int getVendorId() { return vendorId; }
    public void setVendorId(int vendorId) { this.vendorId = vendorId; }
    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
}
