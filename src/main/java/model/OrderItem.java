package model;

public class OrderItem {
    private int orderItemId;
    private int orderId;       // FK
    private int productId;     // FK
    private int qty;
    private String mode;       // "unit", "box"
    private double price;

    // Getters & Setters
    public int getOrderItemId() { return orderItemId; }
    public void setOrderItemId(int id) { this.orderItemId = id; }
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
