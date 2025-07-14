import 'package:get/get.dart';
import '../adicional_beneficiarios_model.dart';
import 'package:flutter/material.dart';

class AdicionalBeneficiariosController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = AdicionalBeneficiariosModel().obs;

  var pensionado = false.obs;
  var pensionAlimenticia = false.obs;
  var viajero = false.obs;
  var foraneo = false.obs;
  var maternidad = false.obs;
  final hijosController = TextEditingController();
  var beneficiarios = <Map<String, String>>[].obs;

  @override
  void onClose() {
    hijosController.dispose();
    super.onClose();
  }

  void addBeneficiario() {
    beneficiarios.add({'nombre': '', 'porcentaje': ''});
  }

  void removeBeneficiario(int index) {
    if (beneficiarios.length > 1) {
      beneficiarios.removeAt(index);
    }
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.pensionado = pensionado.value;
        val?.pensionAlimenticia = pensionAlimenticia.value;
        val?.viajero = viajero.value;
        val?.foraneo = foraneo.value;
        val?.maternidad = maternidad.value;
        val?.hijos = hijosController.text;
        val?.beneficiarios = beneficiarios;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    pensionado.value = false;
    pensionAlimenticia.value = false;
    viajero.value = false;
    foraneo.value = false;
    maternidad.value = false;
    hijosController.clear();
    beneficiarios.value = [
      {'nombre': '', 'porcentaje': ''},
    ];
  }
}
