package model;

import java.util.Date;

public class CalculatorHistory {
    private int calcId;
    private int userId;
    private String mode;      // "Normal", "Billing"
    private String inputExpression;
    private String result;
    private Date timestamp;

    // Getters & Setters
    public int getCalcId() { return calcId; }
    public void setCalcId(int calcId) { this.calcId = calcId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getInputExpression() { return inputExpression; }
    public void setInputExpression(String inputExpression) { this.inputExpression = inputExpression; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
