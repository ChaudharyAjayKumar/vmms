package implementor;

import operation.CartOperation;
import model.CartItem;
import db_config.GetConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CartImplementor implements CartOperation {

    @Override
    public boolean addToCart(int vendorId, int productId, int qty, String mode, double price) {
        String call = "{CALL sp_add_to_cart(?, ?, ?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, vendorId);
            cs.setInt(2, productId);
            cs.setInt(3, qty);
            cs.setString(4, mode);
            cs.setDouble(5, price);

            cs.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCartItem(int cartId, int qty, String mode) {
        String call = "{CALL sp_update_cart_item(?, ?, ?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, cartId);
            cs.setInt(2, qty);
            cs.setString(3, mode);

            cs.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean removeCartItem(int cartId) {
        String call = "{CALL sp_remove_cart_item(?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {
            cs.setInt(1, cartId);

            cs.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CartItem> getCartItems(int vendorId) {
        List<CartItem> cartItems = new ArrayList<>();
        String call = "{CALL sp_get_cart_items(?)}";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(call)) {

            cs.setInt(1, vendorId);
            ResultSet rs = cs.executeQuery();

            while (rs.next()) {
                CartItem item = new CartItem();
                item.setCartId(rs.getInt("cart_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setQty(rs.getInt("qty"));
                item.setMode(rs.getString("mode"));
                item.setPrice(rs.getDouble("price"));
                cartItems.add(item);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return cartItems;
    }
}
