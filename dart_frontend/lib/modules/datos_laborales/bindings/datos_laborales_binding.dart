import 'package:get/get.dart';
import '../controllers/datos_laborales_controller.dart';

class DatosLaboralesBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DatosLaboralesController>(() => DatosLaboralesController());
  }
}
