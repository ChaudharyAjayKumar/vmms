package model;

public class ReturnItem {
    private int returnItemId;
    private int returnId;       // FK
    private int productId;      // FK
    private int qty;
    private String reason;

    // Getters & Setters
    public int getReturnItemId() { return returnItemId; }
    public void setReturnItemId(int returnItemId) { this.returnItemId = returnItemId; }
    public int getReturnId() { return returnId; }
    public void setReturnId(int returnId) { this.returnId = returnId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
