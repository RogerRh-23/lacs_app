import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/datos_laborales_controller.dart';

class DatosLaboralesView extends StatelessWidget {
  const DatosLaboralesView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<DatosLaboralesController>();
    return SingleChildScrollView(
      child: Form(
        key: controller.formKey,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Información del Puesto y Cliente',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.puestoController,
                decoration: const InputDecoration(
                  labelText: 'Puesto o Categoría',
                  prefixIcon: Icon(Icons.work),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.actividadesController,
                decoration: const InputDecoration(
                  labelText: 'Actividades a Realizar',
                  prefixIcon: Icon(Icons.task),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.empresaController,
                decoration: const InputDecoration(
                  labelText: 'Nombre Empresa Cliente',
                  prefixIcon: Icon(Icons.business),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.rfcEmpresaController,
                decoration: const InputDecoration(
                  labelText: 'RFC Empresa Cliente',
                  prefixIcon: Icon(Icons.receipt_long),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.giroEmpresaController,
                decoration: const InputDecoration(
                  labelText: 'Giro Empresa Cliente',
                  prefixIcon: Icon(Icons.factory),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 32),
              const Text(
                'Detalles del Contrato y Proyecto',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Obx(
                () => DropdownButtonFormField<String>(
                  value: controller.tipoContrato.value.isEmpty
                      ? null
                      : controller.tipoContrato.value,
                  decoration: const InputDecoration(
                    labelText: 'Tipo de Contrato',
                    prefixIcon: Icon(Icons.handshake),
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'determinado',
                      child: Text('Determinado'),
                    ),
                    DropdownMenuItem(
                      value: 'obra_determinada',
                      child: Text('Obra Determinada'),
                    ),
                    DropdownMenuItem(
                      value: 'indeterminado',
                      child: Text('Indeterminado'),
                    ),
                    DropdownMenuItem(
                      value: 'periodo_prueba',
                      child: Text('Periodo de Prueba'),
                    ),
                  ],
                  onChanged: (v) => controller.tipoContrato.value = v ?? '',
                  validator: (v) =>
                      v == null || v.isEmpty ? 'Campo requerido' : null,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.tiempoDuracionController,
                decoration: const InputDecoration(
                  labelText: 'Tiempo Duración (Si Determinado) / Proyecto',
                  prefixIcon: Icon(Icons.hourglass_bottom),
                ),
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
