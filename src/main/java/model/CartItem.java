package model;

public class CartItem {
    private int cartId;
    private int vendorId;     // optional for this context
    private int productId;
    private int qty;
    private String mode;      // "unit" or "box"
    private double price;

    // Getters and setters
    public int getCartId() { return cartId; }
    public void setCartId(int cartId) { this.cartId = cartId; }
    public int getVendorId() { return vendorId; }
    public void setVendorId(int vendorId) { this.vendorId = vendorId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
