class ApiConfig {
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get baseUrl {
    if (_envBaseUrl.isEmpty) {
      throw StateError('API_BASE_URL is required');
    }
    return _envBaseUrl;
  }
}
