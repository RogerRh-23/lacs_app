import 'package:get/get.dart';
import '../datos_laborales_model.dart';
import 'package:flutter/material.dart';

class DatosLaboralesController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = DatosLaboralesModel().obs;

  final puestoController = TextEditingController();
  final actividadesController = TextEditingController();
  final empresaController = TextEditingController();
  final rfcEmpresaController = TextEditingController();
  final giroEmpresaController = TextEditingController();
  var tipoContrato = ''.obs;
  final tiempoDuracionController = TextEditingController();

  @override
  void onClose() {
    puestoController.dispose();
    actividadesController.dispose();
    empresaController.dispose();
    rfcEmpresaController.dispose();
    giroEmpresaController.dispose();
    tiempoDuracionController.dispose();
    super.onClose();
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.puesto = puestoController.text;
        val?.actividades = actividadesController.text;
        val?.empresa = empresaController.text;
        val?.rfcEmpresa = rfcEmpresaController.text;
        val?.giroEmpresa = giroEmpresaController.text;
        val?.tipoContrato = tipoContrato.value;
        val?.tiempoDuracion = tiempoDuracionController.text;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    puestoController.clear();
    actividadesController.clear();
    empresaController.clear();
    rfcEmpresaController.clear();
    giroEmpresaController.clear();
    tipoContrato.value = '';
    tiempoDuracionController.clear();
  }
}
