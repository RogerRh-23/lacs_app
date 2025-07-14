import 'package:get/get.dart';
import '../controllers/datos_personales_controller.dart';

class DatosPersonalesBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DatosPersonalesController>(() => DatosPersonalesController());
  }
}
