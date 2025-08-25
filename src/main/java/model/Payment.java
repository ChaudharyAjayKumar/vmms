package model;

import java.util.Date;

public class Payment {
    private int paymentId;
    private int vendorId;
    private int orderId;
    private double amountPaid;
    private String mode;        // "Cash", "UPI"
    private Date paidOn;

    // Getters & Setters
    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int id) { this.paymentId = id; }
    public int getVendorId() { return vendorId; }
    public void setVendorId(int id) { this.vendorId = id; }
    public int getOrderId() { return orderId; }
    public void setOrderId(int id) { this.orderId = id; }
    public double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public Date getPaidOn() { return paidOn; }
    public void setPaidOn(Date paidOn) { this.paidOn = paidOn; }
	public void setAmount(double double1) {
		// TODO Auto-generated method stub
		
	}
}
