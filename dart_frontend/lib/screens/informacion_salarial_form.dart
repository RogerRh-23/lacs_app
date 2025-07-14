import 'package:flutter/material.dart';

class InformacionSalarialForm extends StatefulWidget {
  const InformacionSalarialForm({Key? key}) : super(key: key);

  @override
  State<InformacionSalarialForm> createState() =>
      _InformacionSalarialFormState();
}

class _InformacionSalarialFormState extends State<InformacionSalarialForm> {
  final _formKey = GlobalKey<FormState>();
  final sueldoBrutoController = TextEditingController();
  final sueldoNetoController = TextEditingController();
  final tipoSalarioController = TextEditingController();
  final sdController = TextEditingController();
  final factorIntegracionController = TextEditingController();
  final sdiController = TextEditingController();
  final empresaPagadoraController = TextEditingController();
  String? formaPago;

  @override
  void dispose() {
    sueldoBrutoController.dispose();
    sueldoNetoController.dispose();
    tipoSalarioController.dispose();
    sdController.dispose();
    factorIntegracionController.dispose();
    sdiController.dispose();
    empresaPagadoraController.dispose();
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
                'Detalles del Salario',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: sueldoBrutoController,
                decoration: const InputDecoration(
                  labelText: 'Sueldo Mensual Bruto',
                  prefixIcon: Icon(Icons.attach_money),
                ),
                keyboardType: TextInputType.number,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: sueldoNetoController,
                decoration: const InputDecoration(
                  labelText: 'Sueldo Mensual Neto',
                  prefixIcon: Icon(Icons.attach_money),
                ),
                keyboardType: TextInputType.number,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: tipoSalarioController,
                decoration: const InputDecoration(
                  labelText: 'Tipo de Salario',
                  prefixIcon: Icon(Icons.monetization_on),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: sdController,
                      decoration: const InputDecoration(
                        labelText: 'SD',
                        prefixIcon: Icon(Icons.monetization_on),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: factorIntegracionController,
                      decoration: const InputDecoration(
                        labelText: 'Factor Integración',
                        prefixIcon: Icon(Icons.calculate),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Campo requerido' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: sdiController,
                decoration: const InputDecoration(
                  labelText: 'SDI',
                  prefixIcon: Icon(Icons.money),
                ),
                keyboardType: TextInputType.number,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: empresaPagadoraController,
                decoration: const InputDecoration(
                  labelText: 'Empresa Pagadora',
                  prefixIcon: Icon(Icons.business),
                ),
                validator: (v) =>
                    v == null || v.isEmpty ? 'Campo requerido' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: formaPago,
                decoration: const InputDecoration(
                  labelText: 'Forma de Pago',
                  prefixIcon: Icon(Icons.payment),
                ),
                items: const [
                  DropdownMenuItem(
                    value: 'quincenal',
                    child: Text('Quincenal'),
                  ),
                  DropdownMenuItem(value: 'mensual', child: Text('Mensual')),
                  DropdownMenuItem(value: 'semanal', child: Text('Semanal')),
                  DropdownMenuItem(value: 'otro', child: Text('Otro')),
                ],
                onChanged: (v) => setState(() => formaPago = v),
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
                      sueldoBrutoController.clear();
                      sueldoNetoController.clear();
                      tipoSalarioController.clear();
                      sdController.clear();
                      factorIntegracionController.clear();
                      sdiController.clear();
                      empresaPagadoraController.clear();
                      formaPago = null;
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
