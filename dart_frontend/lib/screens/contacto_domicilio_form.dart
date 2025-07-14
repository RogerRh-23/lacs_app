import 'package:flutter/material.dart';

class ContactoDomicilioForm extends StatefulWidget {
  const ContactoDomicilioForm({Key? key}) : super(key: key);

  @override
  State<ContactoDomicilioForm> createState() => _ContactoDomicilioFormState();
}

class _ContactoDomicilioFormState extends State<ContactoDomicilioForm> {
  final _formKey = GlobalKey<FormState>();
  final telefonoController = TextEditingController();
  final calleController = TextEditingController();
  final numExtController = TextEditingController();
  final numIntController = TextEditingController();
  final coloniaController = TextEditingController();
  final ciudadController = TextEditingController();
  final estadoController = TextEditingController();
  final cpController = TextEditingController();

  @override
  void dispose() {
    telefonoController.dispose();
    calleController.dispose();
    numExtController.dispose();
    numIntController.dispose();
    coloniaController.dispose();
    ciudadController.dispose();
    estadoController.dispose();
    cpController.dispose();
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
                'Información de Contacto',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: telefonoController,
                decoration: const InputDecoration(
                  labelText: 'Número de Teléfono',
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 32),
              const Text(
                'Detalles del Domicilio Personal',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: calleController,
                decoration: const InputDecoration(
                  labelText: 'Calle',
                  prefixIcon: Icon(Icons.home),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: numExtController,
                      decoration: const InputDecoration(
                        labelText: 'Número Exterior',
                        prefixIcon: Icon(Icons.tag),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: numIntController,
                      decoration: const InputDecoration(
                        labelText: 'Número Interior (Opcional)',
                        prefixIcon: Icon(Icons.door_front_door),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: coloniaController,
                decoration: const InputDecoration(
                  labelText: 'Colonia',
                  prefixIcon: Icon(Icons.location_city),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: ciudadController,
                      decoration: const InputDecoration(
                        labelText: 'Ciudad',
                        prefixIcon: Icon(Icons.location_city),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: estadoController,
                      decoration: const InputDecoration(
                        labelText: 'Estado',
                        prefixIcon: Icon(Icons.public),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: cpController,
                decoration: const InputDecoration(
                  labelText: 'Código Postal',
                  prefixIcon: Icon(Icons.markunread_mailbox),
                ),
                keyboardType: TextInputType.number,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
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
                      telefonoController.clear();
                      calleController.clear();
                      numExtController.clear();
                      numIntController.clear();
                      coloniaController.clear();
                      ciudadController.clear();
                      estadoController.clear();
                      cpController.clear();
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
