import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme => ThemeData(
    primaryColor: const Color(0xFF2e4d50),
    scaffoldBackgroundColor: const Color(0xFFe1dfea),
    fontFamily: 'Montserrat',
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: const Color(0xFF2e4d50),
      secondary: const Color(0xFF376063),
      background: const Color(0xFFe1dfea),
      surface: const Color(0xFFF9FAFB),
      onPrimary: const Color(0xFFe1dfea),
      onSurface: const Color(0xFF333333),
    ),
    inputDecorationTheme: const InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(10)),
      ),
      labelStyle: TextStyle(
        fontWeight: FontWeight.w500,
        color: Color(0xFF6b7280),
        fontSize: 14,
      ),
      filled: true,
      fillColor: Color(0xFFF9FAFB),
      contentPadding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      floatingLabelStyle: TextStyle(
        color: Color(0xFF2e4d50),
        fontWeight: FontWeight.bold,
        fontSize: 12,
      ),
    ),
    textTheme: const TextTheme(
      headlineSmall: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: Color(0xFF2e4d50),
      ),
      titleLarge: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        color: Color(0xFF2e4d50),
      ),
      bodyMedium: TextStyle(fontSize: 16, color: Color(0xFF333333)),
      labelSmall: TextStyle(fontSize: 12, color: Color(0xFF6b7280)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Color(0xFF2e4d50),
        foregroundColor: Color(0xFFe1dfea),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
        textStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          fontFamily: 'Montserrat',
        ),
        elevation: 4,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        backgroundColor: Color(0xFFF9FAFB),
        foregroundColor: Color(0xFF333333),
        side: BorderSide(color: Color(0xFFb0b0b0)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
        textStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          fontFamily: 'Montserrat',
        ),
      ),
    ),
    cardTheme: const CardThemeData(
      color: Color(0xFFe1dfea),
      elevation: 6,
      margin: EdgeInsets.symmetric(vertical: 20, horizontal: 0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(15)),
      ),
    ),
  );
}
