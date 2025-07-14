import 'package:flutter/material.dart';

class DatosPersonalesForm extends StatefulWidget {
  const DatosPersonalesForm({Key? key}) : super(key: key);

  @override
  State<DatosPersonalesForm> createState() => _DatosPersonalesFormState();
}

class _DatosPersonalesFormState extends State<DatosPersonalesForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController apellidoPaternoController =
      TextEditingController();
  final TextEditingController apellidoMaternoController =
      TextEditingController();
  final TextEditingController nombreController = TextEditingController();
  final TextEditingController fechaNacimientoController =
      TextEditingController();
  final TextEditingController edadController = TextEditingController();
  final TextEditingController lugarNacimientoController =
      TextEditingController();
  final TextEditingController nacionalidadController = TextEditingController();
  String? sexo;
  String? estadoCivil;

  @override
  void dispose() {
    apellidoPaternoController.dispose();
    apellidoMaternoController.dispose();
    nombreController.dispose();
    fechaNacimientoController.dispose();
    edadController.dispose();
    lugarNacimientoController.dispose();
    nacionalidadController.dispose();
    super.dispose();
  }

  void calcularEdad(String fecha) {
    if (fecha.isEmpty) {
      edadController.text = '';
      return;
    }
    try {
      final birthDate = DateTime.parse(fecha);
      final today = DateTime.now();
      int age = today.year - birthDate.year;
      if (today.month < birthDate.month ||
          (today.month == birthDate.month && today.day < birthDate.day)) {
        age--;
      }
      edadController.text = age.toString();
    } catch (_) {
      edadController.text = '';
    }
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
                'Información General del Empleado',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: _buildInput(
                      controller: apellidoPaternoController,
                      label: 'Apellido Paterno',
                      icon: Icons.person,
                      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildInput(
                      controller: apellidoMaternoController,
                      label: 'Apellido Materno',
                      icon: Icons.person,
                      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildInput(
                      controller: nombreController,
                      label: 'Nombre(s)',
                      icon: Icons.person,
                      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _buildDateInput(
                      controller: fechaNacimientoController,
                      label: 'Fecha de Nacimiento',
                      icon: Icons.calendar_today,
                      onChanged: calcularEdad,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildInput(
                      controller: edadController,
                      label: 'Edad',
                      icon: Icons.person_outline,
                      readOnly: true,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _buildInput(
                      controller: lugarNacimientoController,
                      label: 'Lugar de Nacimiento',
                      icon: Icons.location_on,
                      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildInput(
                      controller: nacionalidadController,
                      label: 'Nacionalidad',
                      icon: Icons.flag,
                      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _buildDropdown(
                      value: sexo,
                      label: 'Sexo',
                      icon: Icons.transgender,
                      items: const [
                        DropdownMenuItem(
                          value: 'masculino',
                          child: Text('Masculino'),
                        ),
                        DropdownMenuItem(
                          value: 'femenino',
                          child: Text('Femenino'),
                        ),
                        DropdownMenuItem(value: 'otro', child: Text('Otro')),
                      ],
                      onChanged: (val) => setState(() => sexo = val),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildDropdown(
                      value: estadoCivil,
                      label: 'Estado Civil',
                      icon: Icons.favorite,
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
                          value: 'divorciado',
                          child: Text('Divorciado(a)'),
                        ),
                        DropdownMenuItem(
                          value: 'viudo',
                          child: Text('Viudo(a)'),
                        ),
                        DropdownMenuItem(
                          value: 'unionLibre',
                          child: Text('Unión Libre'),
                        ),
                      ],
                      onChanged: (val) => setState(() => estadoCivil = val),
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
                      if (_formKey.currentState!.validate()) {
                        // Guardar datos
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Datos guardados (simulado)'),
                          ),
                        );
                      }
                    },
                    child: const Text('Guardar Datos Personales'),
                  ),
                  const SizedBox(width: 16),
                  OutlinedButton(
                    onPressed: () {
                      _formKey.currentState!.reset();
                      apellidoPaternoController.clear();
                      apellidoMaternoController.clear();
                      nombreController.clear();
                      fechaNacimientoController.clear();
                      edadController.clear();
                      lugarNacimientoController.clear();
                      nacionalidadController.clear();
                      setState(() {
                        sexo = null;
                        estadoCivil = null;
                      });
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

  Widget _buildInput({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool readOnly = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      readOnly: readOnly,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
      ),
      validator: validator,
    );
  }

  Widget _buildDateInput({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required void Function(String) onChanged,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
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
          controller.text = picked.toIso8601String().split('T')[0];
          onChanged(controller.text);
        }
      },
      onChanged: onChanged,
      validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
    );
  }

  Widget _buildDropdown({
    required String? value,
    required String label,
    required IconData icon,
    required List<DropdownMenuItem<String>> items,
    required void Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
      ),
      items: items,
      onChanged: onChanged,
      validator: (v) => v == null || v.isEmpty ? 'Campo requerido' : null,
    );
  }
}
