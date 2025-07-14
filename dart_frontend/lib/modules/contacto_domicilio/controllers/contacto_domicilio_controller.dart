import 'package:get/get.dart';
import '../contacto_domicilio_model.dart';
import 'package:flutter/material.dart';

class ContactoDomicilioController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = ContactoDomicilioModel().obs;

  final telefonoController = TextEditingController();
  final calleController = TextEditingController();
  final numExtController = TextEditingController();
  final numIntController = TextEditingController();
  final coloniaController = TextEditingController();
  final ciudadController = TextEditingController();
  final estadoController = TextEditingController();
  final cpController = TextEditingController();

  @override
  void onClose() {
    telefonoController.dispose();
    calleController.dispose();
    numExtController.dispose();
    numIntController.dispose();
    coloniaController.dispose();
    ciudadController.dispose();
    estadoController.dispose();
    cpController.dispose();
    super.onClose();
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.telefono = telefonoController.text;
        val?.calle = calleController.text;
        val?.numExt = numExtController.text;
        val?.numInt = numIntController.text;
        val?.colonia = coloniaController.text;
        val?.ciudad = ciudadController.text;
        val?.estado = estadoController.text;
        val?.cp = cpController.text;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    telefonoController.clear();
    calleController.clear();
    numExtController.clear();
    numIntController.clear();
    coloniaController.clear();
    ciudadController.clear();
    estadoController.clear();
    cpController.clear();
  }
}
