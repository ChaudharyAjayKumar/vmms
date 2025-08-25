package model;

public class DeliveryPartner {
    private int deliveryPartnerId;
    private int userId;      // FK to User
    private String name;
    private String contact;
    private String currentStatus;  // "Available", "OnDuty", "Offline"

    // Getters & Setters
    public int getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(int id) { this.deliveryPartnerId = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
}
