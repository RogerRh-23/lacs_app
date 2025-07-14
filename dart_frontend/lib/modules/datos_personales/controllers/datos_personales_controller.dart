import 'package:get/get.dart';
import '../datos_personales_model.dart';
import 'package:flutter/material.dart';

class DatosPersonalesController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = DatosPersonalesModel().obs;

  final apellidoPaternoController = TextEditingController();
  final apellidoMaternoController = TextEditingController();
  final nombreController = TextEditingController();
  final fechaNacimientoController = TextEditingController();
  final edadController = TextEditingController();
  final lugarNacimientoController = TextEditingController();
  final nacionalidadController = TextEditingController();
  var sexo = ''.obs;
  var estadoCivil = ''.obs;

  @override
  void onClose() {
    apellidoPaternoController.dispose();
    apellidoMaternoController.dispose();
    nombreController.dispose();
    fechaNacimientoController.dispose();
    edadController.dispose();
    lugarNacimientoController.dispose();
    nacionalidadController.dispose();
    super.onClose();
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.apellidoPaterno = apellidoPaternoController.text;
        val?.apellidoMaterno = apellidoMaternoController.text;
        val?.nombre = nombreController.text;
        val?.fechaNacimiento = fechaNacimientoController.text;
        val?.edad = edadController.text;
        val?.lugarNacimiento = lugarNacimientoController.text;
        val?.nacionalidad = nacionalidadController.text;
        val?.sexo = sexo.value;
        val?.estadoCivil = estadoCivil.value;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    apellidoPaternoController.clear();
    apellidoMaternoController.clear();
    nombreController.clear();
    fechaNacimientoController.clear();
    edadController.clear();
    lugarNacimientoController.clear();
    nacionalidadController.clear();
    sexo.value = '';
    estadoCivil.value = '';
  }
}
