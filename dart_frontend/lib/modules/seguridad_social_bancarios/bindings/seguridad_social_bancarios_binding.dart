import 'package:get/get.dart';
import '../controllers/seguridad_social_bancarios_controller.dart';

class SeguridadSocialBancariosBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SeguridadSocialBancariosController>(
      () => SeguridadSocialBancariosController(),
    );
  }
}
