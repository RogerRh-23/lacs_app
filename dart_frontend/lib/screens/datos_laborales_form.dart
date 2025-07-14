import 'package:flutter/material.dart';

class DatosLaboralesForm extends StatefulWidget {
  const DatosLaboralesForm({Key? key}) : super(key: key);

  @override
  State<DatosLaboralesForm> createState() => _DatosLaboralesFormState();
}

class _DatosLaboralesFormState extends State<DatosLaboralesForm> {
  final _formKey = GlobalKey<FormState>();
  final puestoController = TextEditingController();
  final actividadesController = TextEditingController();
  final empresaController = TextEditingController();
  final rfcEmpresaController = TextEditingController();
  final giroEmpresaController = TextEditingController();
  String? tipoContrato;
  final tiempoDuracionController = TextEditingController();

  @override
  void dispose() {
    puestoController.dispose();
    actividadesController.dispose();
    empresaController.dispose();
    rfcEmpresaController.dispose();
    giroEmpresaController.dispose();
    tiempoDuracionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Form(
        key: _formKey,
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
                controller: puestoController,
                decoration: const InputDecoration(
                  labelText: 'Puesto o Categoría',
                  prefixIcon: Icon(Icons.work),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: actividadesController,
                decoration: const InputDecoration(
                  labelText: 'Actividades a Realizar',
                  prefixIcon: Icon(Icons.task),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: empresaController,
                decoration: const InputDecoration(
                  labelText: 'Nombre Empresa Cliente',
                  prefixIcon: Icon(Icons.business),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: rfcEmpresaController,
                decoration: const InputDecoration(
                  labelText: 'RFC Empresa Cliente',
                  prefixIcon: Icon(Icons.receipt_long),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: giroEmpresaController,
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
              DropdownButtonFormField<String>(
                value: tipoContrato,
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
                onChanged: (v) => setState(() => tipoContrato = v),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: tiempoDuracionController,
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
                      if (_formKey.currentState!.validate()) {
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
                    onPressed: () {
                      _formKey.currentState!.reset();
                      puestoController.clear();
                      actividadesController.clear();
                      empresaController.clear();
                      rfcEmpresaController.clear();
                      giroEmpresaController.clear();
                      tipoContrato = null;
                      tiempoDuracionController.clear();
                      setState(() {});
                    },
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
