package implementor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Product;
import operation.ProductOperations;
import db_config.GetConnection;

public class ProductImplementor implements ProductOperations {

    @Override
    public List<Product> getAllActiveProducts() {
        List<Product> products = new ArrayList<>();
        String query = "CALL sp_get_active_products()";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Product product = mapProduct(rs);
                products.add(product);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return products;
    }

    @Override
    public Product getProductById(int productId) {
        Product product = null;
        String query = "SELECT * FROM products WHERE product_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                product = mapProduct(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return product;
    }

    @Override
    public boolean addProduct(Product product) {
        String query = "CALL sp_add_product(?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(query)) {
            cs.setString(1, product.getName());
            cs.setDouble(2, product.getUnitPrice());
            cs.setDouble(3, product.getBoxPrice());
            cs.setInt(4, product.getQtyPerBox());
            cs.setString(5, product.getImageUrl());
            cs.setBoolean(6, product.isActive());
            cs.registerOutParameter(7, Types.INTEGER);
            cs.registerOutParameter(8, Types.VARCHAR);

            cs.execute();

            int productId = cs.getInt(7);
            String status = cs.getString(8);

            return "Product added successfully".equalsIgnoreCase(status);
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateProduct(Product product) {
        String query = "CALL sp_update_product(?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(query)) {
            cs.setInt(1, product.getProductId());
            cs.setString(2, product.getName());
            cs.setDouble(3, product.getUnitPrice());
            cs.setDouble(4, product.getBoxPrice());
            cs.setInt(5, product.getQtyPerBox());
            cs.setString(6, product.getImageUrl());
            cs.setBoolean(7, product.isActive());
            cs.registerOutParameter(8, Types.VARCHAR);

            cs.execute();

            String status = cs.getString(8);
            return "Product updated successfully".equalsIgnoreCase(status);
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteProduct(int productId) {
        String query = "CALL sp_delete_product(?, ?)";
        try (Connection con = GetConnection.getConnection();
             CallableStatement cs = con.prepareCall(query)) {
            cs.setInt(1, productId);
            cs.registerOutParameter(2, Types.VARCHAR);

            cs.execute();

            String status = cs.getString(2);
            return "Product marked as inactive".equalsIgnoreCase(status);
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isProductActive(int productId) {
        boolean isActive = false;
        String query = "SELECT is_active FROM products WHERE product_id = ?";
        try (Connection con = GetConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                isActive = rs.getBoolean("is_active");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return isActive;
    }

    private Product mapProduct(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setProductId(rs.getInt("product_id"));
        p.setName(rs.getString("name"));
        p.setUnitPrice(rs.getDouble("unit_price"));
        p.setBoxPrice(rs.getDouble("box_price"));
        p.setQtyPerBox(rs.getInt("qty_per_box"));
        p.setImageUrl(rs.getString("image_url"));
        p.setActive(rs.getBoolean("is_active"));
        return p;
    }
}
