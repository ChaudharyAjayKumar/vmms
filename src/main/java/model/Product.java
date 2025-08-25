package model;

public class Product {
    private int productId;
    private String name;
    private double unitPrice;
    private double boxPrice;
    private int qtyPerBox;
    private String imageUrl;
    private boolean isActive;
    private int stockQuantity;

    // Getters & Setters
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public double getBoxPrice() { return boxPrice; }
    public void setBoxPrice(double boxPrice) { this.boxPrice = boxPrice; }
    public int getQtyPerBox() { return qtyPerBox; }
    public void setQtyPerBox(int qtyPerBox) { this.qtyPerBox = qtyPerBox; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
}
