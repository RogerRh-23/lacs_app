import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/adicional_beneficiarios_controller.dart';

class AdicionalBeneficiariosView extends StatelessWidget {
  const AdicionalBeneficiariosView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<AdicionalBeneficiariosController>();
    return SingleChildScrollView(
      child: Form(
        key: controller.formKey,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Información Adicional Personal',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Obx(
                      () => CheckboxListTile(
                        title: const Text('Pensionado'),
                        value: controller.pensionado.value,
                        onChanged: (v) =>
                            controller.pensionado.value = v ?? false,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Obx(
                      () => CheckboxListTile(
                        title: const Text('Pensión Alimenticia'),
                        value: controller.pensionAlimenticia.value,
                        onChanged: (v) =>
                            controller.pensionAlimenticia.value = v ?? false,
                      ),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: Obx(
                      () => CheckboxListTile(
                        title: const Text('Viajero'),
                        value: controller.viajero.value,
                        onChanged: (v) => controller.viajero.value = v ?? false,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Obx(
                      () => CheckboxListTile(
                        title: const Text('Foráneo'),
                        value: controller.foraneo.value,
                        onChanged: (v) => controller.foraneo.value = v ?? false,
                      ),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: Obx(
                      () => CheckboxListTile(
                        title: const Text('Maternidad'),
                        value: controller.maternidad.value,
                        onChanged: (v) =>
                            controller.maternidad.value = v ?? false,
                      ),
                    ),
                  ),
                  Expanded(
                    child: TextFormField(
                      controller: controller.hijosController,
                      decoration: const InputDecoration(
                        labelText: 'Hijo(s)',
                        prefixIcon: Icon(Icons.child_care),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Text(
                'Beneficiarios',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Obx(
                () => ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: controller.beneficiarios.length,
                  itemBuilder: (context, i) {
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            TextFormField(
                              initialValue:
                                  controller.beneficiarios[i]['nombre'],
                              decoration: const InputDecoration(
                                labelText:
                                    'Nombre Completo del Beneficiario(s)',
                                prefixIcon: Icon(Icons.group),
                              ),
                              onChanged: (v) =>
                                  controller.beneficiarios[i]['nombre'] = v,
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              initialValue:
                                  controller.beneficiarios[i]['porcentaje'],
                              decoration: const InputDecoration(
                                labelText: 'Porcentaje',
                                prefixIcon: Icon(Icons.percent),
                                suffixText: '%',
                              ),
                              keyboardType: TextInputType.number,
                              onChanged: (v) =>
                                  controller.beneficiarios[i]['porcentaje'] = v,
                            ),
                            if (controller.beneficiarios.length > 1)
                              Align(
                                alignment: Alignment.centerRight,
                                child: IconButton(
                                  icon: const Icon(
                                    Icons.delete,
                                    color: Colors.red,
                                  ),
                                  onPressed: () =>
                                      controller.removeBeneficiario(i),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                icon: const Icon(Icons.add),
                label: const Text('Agregar Beneficiario'),
                onPressed: controller.addBeneficiario,
              ),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      controller.guardarDatos();
                      if (controller.formKey.currentState!.validate()) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Datos guardados (simulado)'),
                          ),
                        );
                      }
                    },
                    child: const Text('Guardar'),
                  ),
                  const SizedBox(width: 16),
                  OutlinedButton(
                    onPressed: controller.limpiarCampos,
                    child: const Text('Cancelar'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
