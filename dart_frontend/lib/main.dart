import 'package:dart_frontend/datos_personales_form.dart';
import 'package:dart_frontend/screens/adicional_beneficiarios_form.dart';
import 'package:dart_frontend/screens/contacto_domicilio_form.dart';
import 'package:dart_frontend/screens/datos_laborales_form.dart';
import 'package:dart_frontend/screens/home_screen_content.dart';
import 'package:dart_frontend/screens/informacion_salarial_form.dart';
import 'package:dart_frontend/screens/seguridad_social_bancarios_form.dart';
import 'package:dart_frontend/screens/settings_screen.dart';
import 'package:dart_frontend/widgets/sidebar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'theme/app_theme.dart';
import 'modules/datos_personales/views/datos_personales_view.dart';
import 'modules/datos_personales/bindings/datos_personales_binding.dart';
import 'modules/contacto_domicilio/views/contacto_domicilio_view.dart';
import 'modules/contacto_domicilio/bindings/contacto_domicilio_binding.dart';
import 'modules/datos_laborales/views/datos_laborales_view.dart';
import 'modules/datos_laborales/bindings/datos_laborales_binding.dart';
import 'modules/informacion_salarial/views/informacion_salarial_view.dart';
import 'modules/informacion_salarial/bindings/informacion_salarial_binding.dart';
import 'modules/adicional_beneficiarios/views/adicional_beneficiarios_view.dart';
import 'modules/adicional_beneficiarios/bindings/adicional_beneficiarios_binding.dart';
import 'modules/seguridad_social_bancarios/views/seguridad_social_bancarios_view.dart';
import 'modules/seguridad_social_bancarios/bindings/seguridad_social_bancarios_binding.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'LACS App',
      theme: AppTheme.lightTheme,
      initialRoute: '/datos-personales',
      getPages: [
        GetPage(
          name: '/datos-personales',
          page: () => const DatosPersonalesView(),
          binding: DatosPersonalesBinding(),
        ),
        GetPage(
          name: '/contacto-domicilio',
          page: () => const ContactoDomicilioView(),
          binding: ContactoDomicilioBinding(),
        ),
        GetPage(
          name: '/datos-laborales',
          page: () => const DatosLaboralesView(),
          binding: DatosLaboralesBinding(),
        ),
        GetPage(
          name: '/informacion-salarial',
          page: () => const InformacionSalarialView(),
          binding: InformacionSalarialBinding(),
        ),
        GetPage(
          name: '/adicional-beneficiarios',
          page: () => const AdicionalBeneficiariosView(),
          binding: AdicionalBeneficiariosBinding(),
        ),
        GetPage(
          name: '/seguridad-social-bancarios',
          page: () => const SeguridadSocialBancariosView(),
          binding: SeguridadSocialBancariosBinding(),
        ),
      ],
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool sidebarOpen = true;
  int selectedIndex = 0;

  Widget _getContent() {
    switch (selectedIndex) {
      case 0:
        return const DatosPersonalesForm();
      case 1:
        return const AdicionalBeneficiariosForm();
      case 2:
        return const ContactoDomicilioForm();
      case 3:
        return const DatosLaboralesForm();
      case 4:
        return const InformacionSalarialForm();
      case 5:
        return const SeguridadSocialBancariosForm();
      case 6:
        return const HomeScreenContent();
      case 7:
        return const SettingsScreen();
      default:
        return const Center(child: Text('Selecciona una opción'));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Sidebar(
            isOpen: sidebarOpen,
            onToggle: () => setState(() => sidebarOpen = !sidebarOpen),
            selectedIndex: selectedIndex,
            onSelect: (i) => setState(() => selectedIndex = i),
          ),
          Expanded(
            child: Column(
              children: [
                AppBar(
                  title: Text(_getTitle()),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Theme.of(context).colorScheme.onPrimary,
                  elevation: 0,
                ),
                Expanded(child: _getContent()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getTitle() {
    switch (selectedIndex) {
      case 0:
        return 'Datos Personales';
      case 1:
        return 'Adicional y Beneficiarios';
      case 2:
        return 'Contacto y Domicilio';
      case 3:
        return 'Datos Laborales';
      case 4:
        return 'Información Salarial';
      case 5:
        return 'Seguridad Social y Bancarios';
      case 6:
        return 'Inicio';
      case 7:
        return 'Configuración';
      default:
        return 'LACS';
    }
  }
}
