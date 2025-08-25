package operation;

import java.util.List;
import model.Product;

public interface ProductOperations {
    List<Product> getAllActiveProducts();
    Product getProductById(int productId);
    boolean addProduct(Product product);
    boolean updateProduct(Product product);
    boolean deleteProduct(int productId);
    boolean isProductActive(int productId);
}
