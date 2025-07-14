import 'package:flutter/material.dart';
import '../modules/seguridad_social_bancarios/views/seguridad_social_bancarios_view.dart';
import '../modules/seguridad_social_bancarios/bindings/seguridad_social_bancarios_binding.dart';

class SeguridadSocialBancariosForm extends StatelessWidget {
  const SeguridadSocialBancariosForm({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilderInitializer();
  }
}

class GetBuilderInitializer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Inicializa el binding y muestra la vista
    SeguridadSocialBancariosBinding().dependencies();
    return const SeguridadSocialBancariosView();
  }
}
