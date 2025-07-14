class AdicionalBeneficiariosModel {
  bool pensionado;
  bool pensionAlimenticia;
  bool viajero;
  bool foraneo;
  bool maternidad;
  String hijos;
  List<Map<String, String>> beneficiarios;

  AdicionalBeneficiariosModel({
    this.pensionado = false,
    this.pensionAlimenticia = false,
    this.viajero = false,
    this.foraneo = false,
    this.maternidad = false,
    this.hijos = '',
    this.beneficiarios = const [],
  });
}
