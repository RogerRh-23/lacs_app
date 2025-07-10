// lib/main.dart

import 'package:flutter/material.dart';
// import 'dart:convert'; // Para la integración con el backend
// import 'package:http/http.dart' as http; // Para la integración con el backend

// Definición de colores y radios de borde basados en tus variables SCSS
// ¡IMPORTANTE! Sustituye estos valores con los hexadecimales EXACTOS de tu SCSS.
// Puedes usar herramientas de desarrollo del navegador para obtenerlos.
const Color _colorPrimary = Color(
  0xFF2E4D50,
); // Ejemplo: Color principal de tu sidebar
const Color _colorAccent = Color(
  0xFF5A7D80,
); // Ejemplo: Color de acento para hover/activo
const Color _colorWhite = Color(0xFFFFFFFF); // Blanco puro
const Color _colorDarkText = Color(0xFF333333); // Texto oscuro general
const Color _colorGrayText = Color(
  0xFF666666,
); // Texto gris para etiquetas/placeholders
const Color _colorBackgroundLight = Color(
  0xFFF8F8F8,
); // Fondo claro de la aplicación
const Color _colorBorderLight = Color(
  0xFFE0E0E0,
); // Borde claro para inputs/elementos
// Para la sombra, 0xAA es el valor de opacidad (AA en hex es ~67% de opacidad)
const Color _colorShadowMedium = Color(
  0xAA000000,
); // Sombra más pronunciada para elementos flotantes

const double _borderRadiusValue = 12.0; // Tu $border-radius, convertido a dp

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LACS App',
      theme: ThemeData(
        // Colores principales del tema
        primaryColor: _colorPrimary,
        hintColor:
            _colorAccent, // Usado para acentos como el color de enfoque de inputs
        canvasColor:
            _colorBackgroundLight, // Color de fondo general para elementos como Drawer
        scaffoldBackgroundColor:
            _colorBackgroundLight, // Color de fondo predeterminado para Scaffolds
        // Paleta de colores Material Design (se genera automáticamente a partir de primaryColor)
        // Puedes personalizarla si necesitas matices muy específicos
        primarySwatch: MaterialColor(_colorPrimary.value, const <int, Color>{
          50: Color(0xFFE0E5E6),
          100: Color(0xFFB3BDC0),
          200: Color(0xFF809297),
          300: Color(0xFF4D676D),
          400: Color(0xFF26494F),
          500: _colorPrimary,
          600: Color(0xFF294649),
          700: Color(0xFF243D3F),
          800: Color(0xFF1F3536),
          900: Color(0xFF172828),
        }),

        // Configuración de tipografía (Montserrat e Inter)
        // ¡IMPORTANTE! Necesitas importar estas fuentes en pubspec.yaml y ejecutar 'flutter pub get'
        fontFamily: 'Montserrat', // Fuente principal de la aplicación
        textTheme: TextTheme(
          // Estilos de texto para diferentes usos
          // Puedes añadir más estilos para replicar tus h1, h2, p, etc.
          headlineLarge: TextStyle(
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w700,
            fontSize: 32, // Ajusta según tu diseño
            color: _colorPrimary,
          ),
          headlineMedium: TextStyle(
            // Usado para "Bienvenido a LACS"
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w700,
            fontSize: 24, // Ajusta según tu diseño
            color: _colorPrimary,
          ),
          headlineSmall: TextStyle(
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w700,
            fontSize: 18, // Para títulos de sección
            color: _colorPrimary,
          ),
          bodyLarge: TextStyle(
            // Texto de cuerpo principal
            fontFamily: 'Inter',
            fontSize: 16,
            color: _colorDarkText,
          ),
          bodyMedium: TextStyle(
            // Texto de cuerpo secundario
            fontFamily: 'Inter',
            fontSize: 14,
            color: _colorDarkText,
          ),
          labelLarge: TextStyle(
            // Estilo para texto de botones
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w600,
            fontSize: 18,
            color: _colorWhite,
          ),
          labelMedium: TextStyle(
            // Estilo para etiquetas de input
            fontFamily: 'Inter',
            fontSize: 14,
            color: _colorGrayText,
          ),
        ),

        // Estilos para InputDecoration (campos de texto)
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _colorWhite, // Fondo blanco para inputs
          contentPadding: const EdgeInsets.symmetric(
            vertical: 15.0,
            horizontal: 20.0,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_borderRadiusValue),
            borderSide: BorderSide.none, // Sin borde visible por defecto
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_borderRadiusValue),
            borderSide: BorderSide(
              color: _colorBorderLight,
              width: 1.0,
            ), // Borde ligero cuando no está enfocado
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_borderRadiusValue),
            borderSide: BorderSide(
              color: _colorPrimary,
              width: 2.0,
            ), // Borde al enfocar
          ),
          labelStyle: TextStyle(
            color: _colorGrayText,
            fontFamily: 'Inter',
          ), // Estilo de la etiqueta flotante
          hintStyle: TextStyle(
            color: Colors.grey[400],
            fontFamily: 'Inter',
          ), // Estilo del placeholder
          prefixIconColor: _colorGrayText, // Color de los iconos de prefijo
        ),

        // Estilos para ElevatedButton (botones principales)
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: _colorPrimary,
            foregroundColor: _colorWhite,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(_borderRadiusValue),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            textStyle: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              fontFamily: 'Montserrat',
            ),
            elevation: 8, // Sombra para el botón
            shadowColor: _colorShadowMedium, // Color de la sombra
          ),
        ),
        // Estilos para TextButton (botones de texto)
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: _colorPrimary, // Color de texto principal
            textStyle: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
      home: const LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

// LoginPage (el código de LoginPage queda igual que en la versión anterior)
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    final username = _usernameController.text;
    final password = _passwordController.text;

    if (username.isEmpty || password.isEmpty) {
      _showSnackBar('Por favor, ingresa usuario y contraseña.');
      return;
    }

    print('Intentando iniciar sesión con:');
    print('Usuario: $username');
    print('Contraseña: $password');

    _showSnackBar('Inicio de sesión simulado exitoso!');
  }

  void _showSnackBar(
    String message, {
    Duration duration = const Duration(seconds: 3),
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration,
        action: SnackBarAction(
          label: 'Cerrar',
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_colorPrimary, _colorAccent],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(30.0),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                maxWidth: screenSize.width > 600 ? 400 : screenSize.width * 0.9,
              ),
              child: Container(
                padding: const EdgeInsets.all(30.0),
                decoration: BoxDecoration(
                  color: _colorWhite,
                  borderRadius: BorderRadius.circular(_borderRadiusValue),
                  boxShadow: [
                    BoxShadow(
                      color: _colorShadowMedium,
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Icon(
                      Icons.business_center,
                      size: 100,
                      color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Bienvenido a LACS',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 40),
                    TextField(
                      controller: _usernameController,
                      decoration: const InputDecoration(
                        labelText: 'Usuario',
                        hintText: 'Ingresa tu usuario',
                        prefixIcon: Icon(Icons.person),
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Contraseña',
                        hintText: 'Ingresa tu contraseña',
                        prefixIcon: Icon(Icons.lock),
                      ),
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: _handleLogin,
                      child: const Text('Iniciar Sesión'),
                    ),
                    const SizedBox(height: 20),
                    TextButton(
                      onPressed: () {
                        print('Olvidé mi contraseña presionado');
                      },
                      child: Text(
                        '¿Olvidaste tu contraseña?',
                        style: TextStyle(color: Theme.of(context).primaryColor),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
