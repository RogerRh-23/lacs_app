import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/seguridad_social_bancarios_controller.dart';

class SeguridadSocialBancariosView extends StatelessWidget {
  const SeguridadSocialBancariosView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<SeguridadSocialBancariosController>();
    return SingleChildScrollView(
      child: Form(
        key: controller.formKey,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Documentos de Identificación',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.curpController,
                decoration: const InputDecoration(
                  labelText: 'CURP',
                  prefixIcon: Icon(Icons.credit_card),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.rfcController,
                decoration: const InputDecoration(
                  labelText: 'RFC',
                  prefixIcon: Icon(Icons.receipt_long),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 32),
              const Text(
                'Información IMSS / Infonavit',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.nssController,
                decoration: const InputDecoration(
                  labelText: 'No. de Seguro Social (NSS)',
                  prefixIcon: Icon(Icons.local_hospital),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.fechaAltaImssController,
                decoration: const InputDecoration(
                  labelText: 'Fecha Alta IMSS',
                  prefixIcon: Icon(Icons.calendar_today),
                ),
                readOnly: true,
                onTap: () async {
                  DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    controller.fechaAltaImssController.text = picked
                        .toIso8601String()
                        .split('T')[0];
                  }
                },
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              Obx(
                () => CheckboxListTile(
                  title: const Text('Crédito Infonavit'),
                  value: controller.creditoInfonavit.value,
                  onChanged: (v) =>
                      controller.creditoInfonavit.value = v ?? false,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.numInfonavitController,
                decoration: const InputDecoration(
                  labelText: 'Número Infonavit',
                  prefixIcon: Icon(Icons.confirmation_number),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.registroPatronalController,
                decoration: const InputDecoration(
                  labelText: 'Registro Patronal',
                  prefixIcon: Icon(Icons.app_registration),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.claseRtController,
                decoration: const InputDecoration(
                  labelText: 'Clase RT',
                  prefixIcon: Icon(Icons.local_hospital_outlined),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
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
