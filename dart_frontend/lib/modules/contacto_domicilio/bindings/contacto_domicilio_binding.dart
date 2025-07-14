import 'package:get/get.dart';
import '../controllers/contacto_domicilio_controller.dart';

class ContactoDomicilioBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ContactoDomicilioController>(
      () => ContactoDomicilioController(),
    );
  }
}
