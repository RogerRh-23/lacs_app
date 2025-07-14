import 'package:flutter/material.dart';

class AdicionalBeneficiariosForm extends StatefulWidget {
  const AdicionalBeneficiariosForm({Key? key}) : super(key: key);

  @override
  State<AdicionalBeneficiariosForm> createState() =>
      _AdicionalBeneficiariosFormState();
}

class _AdicionalBeneficiariosFormState
    extends State<AdicionalBeneficiariosForm> {
  final _formKey = GlobalKey<FormState>();
  bool pensionado = false;
  bool pensionAlimenticia = false;
  bool viajero = false;
  bool foraneo = false;
  bool maternidad = false;
  final TextEditingController hijosController = TextEditingController();

  List<Map<String, TextEditingController>> beneficiarios = [
    {'nombre': TextEditingController(), 'porcentaje': TextEditingController()},
  ];

  @override
  void dispose() {
    hijosController.dispose();
    for (var b in beneficiarios) {
      b['nombre']?.dispose();
      b['porcentaje']?.dispose();
    }
    super.dispose();
  }

  void addBeneficiario() {
    setState(() {
      beneficiarios.add({
        'nombre': TextEditingController(),
        'porcentaje': TextEditingController(),
      });
    });
  }

  void removeBeneficiario(int index) {
    if (beneficiarios.length > 1) {
      setState(() {
        beneficiarios[index]['nombre']?.dispose();
        beneficiarios[index]['porcentaje']?.dispose();
        beneficiarios.removeAt(index);
      });
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
                'Información Adicional Personal',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Pensionado'),
                      value: pensionado,
                      onChanged: (v) => setState(() => pensionado = v ?? false),
                    ),
                  ),
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Pensión Alimenticia'),
                      value: pensionAlimenticia,
                      onChanged: (v) =>
                          setState(() => pensionAlimenticia = v ?? false),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Viajero'),
                      value: viajero,
                      onChanged: (v) => setState(() => viajero = v ?? false),
                    ),
                  ),
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Foráneo'),
                      value: foraneo,
                      onChanged: (v) => setState(() => foraneo = v ?? false),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Maternidad'),
                      value: maternidad,
                      onChanged: (v) => setState(() => maternidad = v ?? false),
                    ),
                  ),
                  Expanded(
                    child: TextFormField(
                      controller: hijosController,
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
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: beneficiarios.length,
                itemBuilder: (context, i) {
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          TextFormField(
                            controller: beneficiarios[i]['nombre'],
                            decoration: const InputDecoration(
                              labelText: 'Nombre Completo del Beneficiario(s)',
                              prefixIcon: Icon(Icons.group),
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextFormField(
                            controller: beneficiarios[i]['porcentaje'],
                            decoration: const InputDecoration(
                              labelText: 'Porcentaje',
                              prefixIcon: Icon(Icons.percent),
                              suffixText: '%',
                            ),
                            keyboardType: TextInputType.number,
                          ),
                          if (beneficiarios.length > 1)
                            Align(
                              alignment: Alignment.centerRight,
                              child: IconButton(
                                icon: const Icon(
                                  Icons.delete,
                                  color: Colors.red,
                                ),
                                onPressed: () => removeBeneficiario(i),
                              ),
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                icon: const Icon(Icons.add),
                label: const Text('Agregar Beneficiario'),
                onPressed: addBeneficiario,
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
                      setState(() {
                        pensionado = false;
                        pensionAlimenticia = false;
                        viajero = false;
                        foraneo = false;
                        maternidad = false;
                        hijosController.clear();
                        beneficiarios = [
                          {
                            'nombre': TextEditingController(),
                            'porcentaje': TextEditingController(),
                          },
                        ];
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
}
