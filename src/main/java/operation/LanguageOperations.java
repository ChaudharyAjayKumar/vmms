package operation;

public interface LanguageOperations {
    String getLanguagePreference(int userId);
    boolean setLanguagePreference(int userId, String languageCode);
}
