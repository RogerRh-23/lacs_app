import 'package:get/get.dart';
import '../seguridad_social_bancarios_model.dart';
import 'package:flutter/material.dart';

class SeguridadSocialBancariosController extends GetxController {
  final formKey = GlobalKey<FormState>();
  final model = SeguridadSocialBancariosModel().obs;

  final curpController = TextEditingController();
  final rfcController = TextEditingController();
  final nssController = TextEditingController();
  final fechaAltaImssController = TextEditingController();
  final numInfonavitController = TextEditingController();
  final registroPatronalController = TextEditingController();
  final claseRtController = TextEditingController();
  var creditoInfonavit = false.obs;

  @override
  void onClose() {
    curpController.dispose();
    rfcController.dispose();
    nssController.dispose();
    fechaAltaImssController.dispose();
    numInfonavitController.dispose();
    registroPatronalController.dispose();
    claseRtController.dispose();
    super.onClose();
  }

  void guardarDatos() {
    if (formKey.currentState?.validate() ?? false) {
      model.update((val) {
        val?.curp = curpController.text;
        val?.rfc = rfcController.text;
        val?.nss = nssController.text;
        val?.fechaAltaImss = fechaAltaImssController.text;
        val?.creditoInfonavit = creditoInfonavit.value;
        val?.numInfonavit = numInfonavitController.text;
        val?.registroPatronal = registroPatronalController.text;
        val?.claseRt = claseRtController.text;
      });
    }
  }

  void limpiarCampos() {
    formKey.currentState?.reset();
    curpController.clear();
    rfcController.clear();
    nssController.clear();
    fechaAltaImssController.clear();
    creditoInfonavit.value = false;
    numInfonavitController.clear();
    registroPatronalController.clear();
    claseRtController.clear();
  }
}
