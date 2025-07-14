import 'package:get/get.dart';
import '../controllers/informacion_salarial_controller.dart';

class InformacionSalarialBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<InformacionSalarialController>(
      () => InformacionSalarialController(),
    );
  }
}
