import 'package:get/get.dart';
import '../controllers/adicional_beneficiarios_controller.dart';

class AdicionalBeneficiariosBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AdicionalBeneficiariosController>(
      () => AdicionalBeneficiariosController(),
    );
  }
}
