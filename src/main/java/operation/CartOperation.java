package operation;

import java.util.List;
import model.CartItem;

public interface CartOperation {
    boolean addToCart(int vendorId, int productId, int qty, String mode, double price);
    boolean updateCartItem(int cartId, int qty, String mode);
    boolean removeCartItem(int cartId);
    List<CartItem> getCartItems(int vendorId);
}
