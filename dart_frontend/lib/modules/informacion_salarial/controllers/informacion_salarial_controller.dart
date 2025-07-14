import 'package:get/get.dart';
import '../informacion_salarial_model.dart';
import 'package:flutter/material.dart';

class InformacionSalarialController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = InformacionSalarialModel().obs;

  final sueldoBrutoController = TextEditingController();
  final sueldoNetoController = TextEditingController();
  final tipoSalarioController = TextEditingController();
  final sdController = TextEditingController();
  final factorIntegracionController = TextEditingController();
  final sdiController = TextEditingController();
  final empresaPagadoraController = TextEditingController();
  var formaPago = ''.obs;

  @override
  void onClose() {
    sueldoBrutoController.dispose();
    sueldoNetoController.dispose();
    tipoSalarioController.dispose();
    sdController.dispose();
    factorIntegracionController.dispose();
    sdiController.dispose();
    empresaPagadoraController.dispose();
    super.onClose();
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.sueldoBruto = sueldoBrutoController.text;
        val?.sueldoNeto = sueldoNetoController.text;
        val?.tipoSalario = tipoSalarioController.text;
        val?.sd = sdController.text;
        val?.factorIntegracion = factorIntegracionController.text;
        val?.sdi = sdiController.text;
        val?.empresaPagadora = empresaPagadoraController.text;
        val?.formaPago = formaPago.value;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    sueldoBrutoController.clear();
    sueldoNetoController.clear();
    tipoSalarioController.clear();
    sdController.clear();
    factorIntegracionController.clear();
    sdiController.clear();
    empresaPagadoraController.clear();
    formaPago.value = '';
  }
}
