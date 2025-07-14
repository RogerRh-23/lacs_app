import 'package:dart_frontend/widgets/sidebar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/datos_personales_controller.dart';

class DatosPersonalesView extends StatelessWidget {
  const DatosPersonalesView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<DatosPersonalesController>();
    return Scaffold(
      body: Row(
        children: [
          Sidebar(
            isOpen: true,
            selectedIndex: 0,
            onSelect: (int index) {},
            onToggle: () {},
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Form(
                key: controller.formKey,
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Información General del Empleado',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: controller.apellidoPaternoController,
                              decoration: const InputDecoration(
                                labelText: 'Apellido Paterno',
                                prefixIcon: Icon(Icons.person),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Campo requerido'
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: controller.apellidoMaternoController,
                              decoration: const InputDecoration(
                                labelText: 'Apellido Materno',
                                prefixIcon: Icon(Icons.person),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Campo requerido'
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: controller.nombreController,
                              decoration: const InputDecoration(
                                labelText: 'Nombre(s)',
                                prefixIcon: Icon(Icons.person),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Campo requerido'
                                  : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: controller.lugarNacimientoController,
                              decoration: const InputDecoration(
                                labelText: 'Lugar de Nacimiento',
                                prefixIcon: Icon(Icons.location_city),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Campo requerido'
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: controller.nacionalidadController,
                              decoration: const InputDecoration(
                                labelText: 'Nacionalidad',
                                prefixIcon: Icon(Icons.flag),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Campo requerido'
                                  : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: Obx(
                              () => DropdownButtonFormField<String>(
                                value: controller.sexo.value.isEmpty
                                    ? null
                                    : controller.sexo.value,
                                decoration: const InputDecoration(
                                  labelText: 'Sexo',
                                  prefixIcon: Icon(Icons.wc),
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: 'M',
                                    child: Text('Masculino'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'F',
                                    child: Text('Femenino'),
                                  ),
                                ],
                                onChanged: (val) =>
                                    controller.sexo.value = val ?? '',
                                validator: (v) => v == null || v.isEmpty
                                    ? 'Campo requerido'
                                    : null,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Obx(
                              () => DropdownButtonFormField<String>(
                                value: controller.estadoCivil.value.isEmpty
                                    ? null
                                    : controller.estadoCivil.value,
                                decoration: const InputDecoration(
                                  labelText: 'Estado Civil',
                                  prefixIcon: Icon(Icons.family_restroom),
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: 'soltero',
                                    child: Text('Soltero(a)'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'casado',
                                    child: Text('Casado(a)'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'otro',
                                    child: Text('Otro'),
                                  ),
                                ],
                                onChanged: (val) =>
                                    controller.estadoCivil.value = val ?? '',
                                validator: (v) => v == null || v.isEmpty
                                    ? 'Campo requerido'
                                    : null,
                              ),
                            ),
                          ),
                        ],
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
            ),
          ),
        ],
      ),
    );
  }
}
