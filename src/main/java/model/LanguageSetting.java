package model;

public class LanguageSetting {
    private int userId;
    private String selectedLanguage; // "en", "hi"

    // Getters & Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getSelectedLanguage() { return selectedLanguage; }
    public void setSelectedLanguage(String lang) { this.selectedLanguage = lang; }
}
