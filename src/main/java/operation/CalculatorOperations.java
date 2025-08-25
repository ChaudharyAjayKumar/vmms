package operation;

import java.util.List;
import model.CalculatorHistory;

public interface CalculatorOperations {
    boolean addCalculatorEntry(int userId, String mode, String expression, String result);
    List<CalculatorHistory> getCalculatorHistory(int userId);
}
