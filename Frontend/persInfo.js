document.addEventListener('DOMContentLoaded', () => {
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        // Añade un event listener a cada botón de pestaña
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const tabId = button.dataset.tab;
                document.getElementById(tabId).classList.add('active');
                window.dispatchEvent(new CustomEvent('persInfoContentChanged'));
            });
        });

        document.querySelectorAll('.input-group input, .input-group select, .input-group textarea').forEach(input => {
            if (input.value) {
                input.closest('.input-group').classList.add('is-active');
            }

            input.addEventListener('focus', () => {
                input.closest('.input-group').classList.add('is-active');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.closest('.input-group').classList.remove('is-active');
                }
            });
        });
    }

    const mainContentArea = document.getElementById('main-content-area');
    if (mainContentArea) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (mainContentArea.querySelector('.tab-buttons-container')) {
                        setupTabs();
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        observer.observe(mainContentArea, { childList: true, subtree: true });
        if (mainContentArea.querySelector('.tab-buttons-container')) {
            setupTabs();
        }
    } else {
        setupTabs();
    }

    const columnOrder = [
        { name: 'nombre', header: 'Nombre(s)' },
        { name: 'apellido_paterno', header: 'Apellido Paterno' },
        { name: 'apellido_materno', header: 'Apellido Materno' },
        { name: 'fecha_nacimiento', header: 'Fecha de Nacimiento' },
        { name: 'edad', header: 'Edad' },
        { name: 'lugar_nacimiento', header: 'Lugar de Nacimiento' },
        { name: 'sexo', header: 'Sexo' },
        { name: 'nacionalidad', header: 'Nacionalidad' },
        { name: 'estado_civil', header: 'Estado Civil' },
        { name: 'telefono', header: 'Número de Teléfono' },
        { name: 'calle', header: 'Calle' },
        { name: 'numero_exterior', header: 'Número Exterior' },
        { name: 'numero_interior', header: 'Número Interior (Opcional)' },
        { name: 'colonia', header: 'Colonia' },
        { name: 'ciudad', header: 'Ciudad' },
        { name: 'estado', header: 'Estado' },
        { name: 'codigo_postal', header: 'Código Postal' },
        { name: 'calle_laboral', header: 'Calle Laboral' },
        { name: 'numero_exterior_laboral', header: 'Número Exterior Laboral' },
        { name: 'numero_interior_laboral', header: 'Número Interior Laboral (Opcional)' },
        { name: 'colonia_laboral', header: 'Colonia Laboral' },
        { name: 'ciudad_laboral', header: 'Ciudad Laboral' },
        { name: 'estado_laboral', header: 'Estado Laboral' },
        { name: 'codigo_postal_laboral', header: 'Código Postal Laboral' },
        { name: 'puesto', header: 'Puesto o Categoría' },
        { name: 'actividades', header: 'Actividades a Realizar' },
        { name: 'nombre_empresa_cliente', header: 'Nombre Empresa Cliente' },
        { name: 'rfc_empresa_cliente', header: 'RFC Empresa Cliente' },
        { name: 'giro_empresa_cliente', header: 'Giro Empresa Cliente' },
        { name: 'tipo_contrato', header: 'Tipo de Contrato' },
        { name: 'tiempo_duracion', header: 'Tiempo Duración (Si Determinado) / Nombre Proyecto' },
        { name: 'consiste_proyecto', header: 'En qué Consiste el Proyecto (Obra Determinada)' },
        { name: 'reconocer_antiguedad', header: 'Se le va a reconocer antigüedad' },
        { name: 'fecha_antiguedad_cliente', header: 'Fecha de Antigüedad con el Cliente' },
        { name: 'sueldo_bruto', header: 'Sueldo Mensual Bruto' },
        { name: 'sueldo_neto', header: 'Sueldo Mensual Neto' },
        { name: 'tipo_salario', header: 'Tipo de Salario' },
        { name: 'sd', header: 'SD' },
        { name: 'factor_integracion', header: 'Factor Integración' },
        { name: 'sdi', header: 'SDI' },
        { name: 'empresa_pagadora', header: 'Empresa Pagadora' },
        { name: 'forma_pago', header: 'Forma de Pago (Quincenal/Semanal y Días de Cobertura)' },
        { name: 'curp', header: 'CURP' },
        { name: 'rfc', header: 'RFC' },
        { name: 'nss', header: 'No. de Seguro Social (NSS)' },
        { name: 'fecha_alta_imss', header: 'Fecha Alta IMSS' },
        { name: 'credito_infonavit', header: 'Crédito Infonavit' },
        { name: 'numero_infonavit', header: 'Número Infonavit' },
        { name: 'registro_patronal', header: 'Registro Patronal' },
        { name: 'clase_rt', header: 'Clase RT' },
        { name: 'banco', header: 'Banco' },
        { name: 'cuenta_bancaria', header: 'Cuenta Bancaria' },
        { name: 'clabe_interbancaria', header: 'CLABE Interbancaria' },
        { name: 'pensionado', header: 'Pensionado' },
        { name: 'pension_alimenticia', header: 'Pensión Alimenticia' },
        { name: 'viajero', header: 'Viajero' },
        { name: 'foraneo', header: 'Foráneo' },
        { name: 'maternidad', header: 'Maternidad' },
        { name: 'hijo', header: 'Número de Hijo(s)' },
        { name: 'beneficiario_nombre', header: 'Nombre Completo del Beneficiario(s)' },
        { name: 'beneficiario_porcentaje', header: 'Porcentaje del Beneficiario' },
        { name: 'umf', header: 'UMF' },
        { name: 'incapacidad_beneficiarios', header: 'Incapacidad Beneficiarios' },
        { name: 'tratamiento_medico_beneficiarios', header: 'Tratamiento Médico Beneficiarios' }
    ];

    /**
     * @returns {Object} 
     */
    const collectAllFormData = () => {
        const formData = {};
        const formElements = document.querySelectorAll('.pers-forms input, .pers-forms select, .pers-forms textarea');

        formElements.forEach(element => {
            const name = element.name;
            if (!name) {
                return;
            }

            if (element.type === 'checkbox') {
                formData[name] = element.checked ? 'Sí' : 'No';
            } else {
                formData[name] = element.value;
            }
        });
        return formData;
    };

    /**
     * @param {Object} data - 
     * @returns {string}
     */
    const convertToCsv = (data) => {
        const headers = columnOrder.map(col => col.header);

        const values = columnOrder.map(col => {
            const value = data[col.name] || '';
            return escapeCsvValue(value);
        });

        const escapeCsvValue = (value) => {
            if (value === null || value === undefined) {
                return '';
            }
            let stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        const csvHeaders = headers.join(',');
        const csvRow = values.join(',');

        return `${csvHeaders}\n${csvRow}`;
    };

    /**
     * @param {string} csvString
     * @param {string} filename
     */
    const downloadCsv = (csvString, filename = 'informacion_personal.csv') => {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            console.warn('Tu navegador no soporta la descarga directa. CSV generado en consola.');
            console.log(csvString);
        }
    };

    const forms = document.querySelectorAll('.pers-forms .tab-content');
    forms.forEach(formContent => {
        const submitButton = formContent.querySelector('.submit-button');

        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();

                const currentTabData = {};
                formContent.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.name) {
                        if (input.type === 'checkbox') {
                            currentTabData[input.name] = input.checked ? 'Sí' : 'No';
                        } else {
                            currentTabData[input.name] = input.value;
                        }
                    }
                });
                console.log(`Datos de la pestaña ${formContent.id} (guardado simulado):`, currentTabData);

                const showMessageModal = (message) => {
                    let modal = document.getElementById('customMessageModal');
                    if (!modal) {
                        modal = document.createElement('div');
                        modal.id = 'customMessageModal';
                        modal.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                            z-index: 1000;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 15px;
                            max-width: 90%;
                            text-align: center;
                        `;
                        const messageText = document.createElement('p');
                        messageText.id = 'customMessageText';
                        messageText.style.cssText = `
                            font-family: "Montserrat", sans-serif;
                            color: var(--color-dark-text);
                            font-size: 1.1rem;
                        `;
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'Cerrar';
                        closeButton.style.cssText = `
                            padding: 10px 20px;
                            background-color: var(--color-primary);
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-family: "Montserrat", sans-serif;
                            font-size: 1rem;
                        `;
                        closeButton.onclick = () => modal.remove();
                        modal.appendChild(messageText);
                        modal.appendChild(closeButton);
                        document.body.appendChild(modal);
                    }
                    document.getElementById('customMessageText').textContent = message;
                    modal.style.display = 'flex';
                };

                showMessageModal(`Datos de ${formContent.id} guardados (simulado).`);

                const allFormDataForExport = collectAllFormData();
                const csv = convertToCsv(allFormDataForExport);
                downloadCsv(csv, 'Altas_IMSS_-ALTAS_LACS.csv');
                console.log('Todos los datos del formulario exportados:', allFormDataForExport);
            });
        }
    });

    const birthDateInput = document.getElementById('pers-fechNac');
    const ageInput = document.getElementById('pers-edad');

    const calculateAge = () => {
        if (birthDateInput && ageInput && birthDateInput.value) {
            const birthDate = new Date(birthDateInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            ageInput.value = age >= 0 ? age : '';

            if (ageInput.value) {
                ageInput.closest('.input-group').classList.add('is-active');
            } else {
                ageInput.closest('.input-group').classList.remove('is-active');
            }
        } else if (ageInput) {
            ageInput.value = '';
            ageInput.closest('.input-group').classList.remove('is-active');
        }
    };

    if (birthDateInput) {
        birthDateInput.addEventListener('change', calculateAge);
    }
});
