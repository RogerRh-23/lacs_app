import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Sidebar extends StatelessWidget {
  final bool isOpen;
  final Function()? onToggle;
  final int selectedIndex;
  final Function(int) onSelect;

  const Sidebar({
    Key? key,
    required this.isOpen,
    this.onToggle,
    required this.selectedIndex,
    required this.onSelect,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: isOpen ? 250 : 55,
      decoration: BoxDecoration(
        color: const Color(0xFF2b2a33),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            offset: const Offset(2, 0),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          // Logo
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Row(
              children: [
                const SizedBox(width: 10),
                Image.asset(
                  'assets/LACS-Logo.png',
                  height: 40,
                  fit: BoxFit.contain,
                ),
                if (isOpen)
                  const Padding(
                    padding: EdgeInsets.only(left: 10),
                    child: Text(
                      'LACS',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          // Navigation
          Expanded(
            child: ListView(
              children: [
                _SidebarItem(
                  icon: Icons.person,
                  label: 'Datos Personales',
                  isOpen: isOpen,
                  selected: selectedIndex == 0,
                  onTap: () => Get.toNamed('/datos-personales'),
                ),
                _SidebarItem(
                  icon: Icons.group,
                  label: 'Adicional y Beneficiarios',
                  isOpen: isOpen,
                  selected: selectedIndex == 1,
                  onTap: () => Get.toNamed('/adicional-beneficiarios'),
                ),
                _SidebarItem(
                  icon: Icons.contact_mail,
                  label: 'Contacto y Domicilio',
                  isOpen: isOpen,
                  selected: selectedIndex == 2,
                  onTap: () => Get.toNamed('/contacto-domicilio'),
                ),
                _SidebarItem(
                  icon: Icons.work,
                  label: 'Datos Laborales',
                  isOpen: isOpen,
                  selected: selectedIndex == 3,
                  onTap: () => Get.toNamed('/datos-laborales'),
                ),
                _SidebarItem(
                  icon: Icons.attach_money,
                  label: 'Información Salarial',
                  isOpen: isOpen,
                  selected: selectedIndex == 4,
                  onTap: () => Get.toNamed('/informacion-salarial'),
                ),
                _SidebarItem(
                  icon: Icons.security,
                  label: 'Seguridad Social y Bancarios',
                  isOpen: isOpen,
                  selected: selectedIndex == 5,
                  onTap: () => Get.toNamed('/seguridad-social-bancarios'),
                ),
                const Divider(),
                _SidebarItem(
                  icon: Icons.home,
                  label: 'Inicio',
                  isOpen: isOpen,
                  selected: selectedIndex == 6,
                  onTap: () => Get.toNamed('/datos-personales'),
                ),
                _SidebarItem(
                  icon: Icons.settings,
                  label: 'Configuración',
                  isOpen: isOpen,
                  selected: selectedIndex == 7,
                  onTap: () {},
                ),
              ],
            ),
          ),
          // User section
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Icon(Icons.person, color: Colors.white),
                const SizedBox(width: 10),
                if (isOpen)
                  const Padding(
                    padding: EdgeInsets.only(left: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Usuario',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Rol',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          // Toggle button
          IconButton(
            icon: Icon(
              isOpen ? Icons.arrow_back_ios : Icons.arrow_forward_ios,
              color: Colors.white,
            ),
            onPressed: onToggle,
          ),
        ],
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isOpen;
  final bool selected;
  final VoidCallback onTap;

  const _SidebarItem({
    Key? key,
    required this.icon,
    required this.label,
    required this.isOpen,
    required this.selected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: isOpen ? 250 : 55,
      decoration: BoxDecoration(
        color: const Color(0xFF2b2a33),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            offset: const Offset(2, 0),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          // Logo
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Row(
              children: [
                const SizedBox(width: 10),
                Image.asset(
                  'assets/LACS-Logo.png',
                  height: 40,
                  fit: BoxFit.contain,
                ),
                if (isOpen)
                  const Padding(
                    padding: EdgeInsets.only(left: 10),
                    child: Text(
                      'LACS',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
