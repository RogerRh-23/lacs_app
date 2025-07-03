document.addEventListener('DOMContentLoaded', () => {
    // Función para configurar la funcionalidad de las pestañas
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button'); // Selecciona todos los botones de pestaña
        const tabContents = document.querySelectorAll('.tab-content'); // Selecciona todo el contenido de las pestañas

        // Añade un event listener a cada botón de pestaña
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remueve la clase 'active' de todos los botones y contenidos de pestaña
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const tabId = button.dataset.tab;
                document.getElementById(tabId).classList.add('active');

                // Trigger a global scrollbar update after tab content changes
                // This is important because the height of the content might change
                // and the main script.js needs to recalculate the scrollbar.
                // We use a custom event to communicate with the main script.js
                window.dispatchEvent(new CustomEvent('persInfoContentChanged'));
            });
        });

        // Manejo de la clase 'is-active' para las etiquetas de los inputs
        // Esto hace que la etiqueta se mueva cuando el input está enfocado o tiene valor
        document.querySelectorAll('.input-group input, .input-group select, .input-group textarea').forEach(input => {
            // Si el input ya tiene un valor al cargar la página, añade la clase 'is-active'
            if (input.value) {
                input.closest('.input-group').classList.add('is-active');
            }

            // Cuando el input obtiene el foco, añade la clase 'is-active'
            input.addEventListener('focus', () => {
                input.closest('.input-group').classList.add('is-active');
            });

            // Cuando el input pierde el foco, si no tiene valor, remueve la clase 'is-active'
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.closest('.input-group').classList.remove('is-active');
                }
            });
        });
    }

    // Se asegura de que setupTabs se llame después de que persInfo.html se haya cargado.
    // Esto es importante porque persInfo.html se carga dinámicamente en index.html.
    const mainContentArea = document.getElementById('main-content-area');
    if (mainContentArea) {
        // Usa un MutationObserver para detectar cuando el contenido es añadido a main-content-area
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Verifica si los nodos añadidos contienen nuestra estructura de pestañas
                    if (mainContentArea.querySelector('.tab-buttons-container')) {
                        setupTabs(); // Configura las pestañas una vez que el contenido está presente
                        observer.disconnect(); // Desconecta el observer para evitar llamadas múltiples
                        break;
                    }
                }
            }
        });

        // Empieza a observar el mainContentArea por cambios en sus hijos
        observer.observe(mainContentArea, { childList: true, subtree: true });

        // Si persInfo.html ya está cargado (por ejemplo, si es el contenido directo del body),
        // llama a setupTabs directamente.
        if (mainContentArea.querySelector('.tab-buttons-container')) {
            setupTabs();
        }
    } else {
        // En caso de que 'main-content-area' no exista, asume que el contenido de persInfo.html
        // es el contenido directo del body y llama a setupTabs.
        setupTabs();
    }

    // --- Lógica de Exportación a Excel (CSV) ---

    // Define el orden de las columnas y sus encabezados EXACTAMENTE como en tu plantilla de Excel
    // Asegúrate de que los 'name' de tus inputs en persInfo.html coincidan con estas claves.
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
     * Recopila todos los datos de los campos de formulario en todas las pestañas.
     * @returns {Object} Un objeto con los nombres de los campos como claves y sus valores como valores.
     */
    const collectAllFormData = () => {
        const formData = {};
        // Selecciona todos los inputs, selects y textareas dentro del contenedor de formularios
        const formElements = document.querySelectorAll('.pers-forms input, .pers-forms select, .pers-forms textarea');

        formElements.forEach(element => {
            const name = element.name;
            if (!name) {
                // console.warn('Elemento de formulario sin atributo "name". No se incluirá en la exportación:', element);
                return; // Ignorar elementos sin nombre
            }

            if (element.type === 'checkbox') {
                formData[name] = element.checked ? 'Sí' : 'No'; // Convertir booleano a texto legible
            } else {
                formData[name] = element.value;
            }
        });
        return formData;
    };

    /**
     * Convierte un objeto de datos en una cadena CSV, respetando el orden de las columnas.
     * @param {Object} data - El objeto con los datos del formulario.
     * @returns {string} La cadena CSV.
     */
    const convertToCsv = (data) => {
        // Generar los encabezados en el orden definido
        const headers = columnOrder.map(col => col.header);

        // Generar la fila de datos en el orden definido
        const values = columnOrder.map(col => {
            // Usa el nombre del campo (col.name) para obtener el valor del objeto de datos
            const value = data[col.name] || ''; // Si el valor no existe, usa una cadena vacía
            return escapeCsvValue(value);
        });

        // Función para escapar valores CSV (manejar comas, comillas, saltos de línea)
        const escapeCsvValue = (value) => {
            if (value === null || value === undefined) {
                return '';
            }
            let stringValue = String(value);
            // Si el valor contiene comas, comillas dobles o saltos de línea, se encierra entre comillas dobles
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
                // Escapar comillas dobles dentro del valor duplicándolas
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Unir los encabezados y valores
        const csvHeaders = headers.join(',');
        const csvRow = values.join(',');

        return `${csvHeaders}\n${csvRow}`; // Retorna los encabezados seguidos de la fila de datos
    };

    /**
     * Descarga una cadena CSV como un archivo.
     * @param {string} csvString - La cadena CSV a descargar.
     * @param {string} filename - El nombre del archivo CSV.
     */
    const downloadCsv = (csvString, filename = 'informacion_personal.csv') => {
        // Crea un Blob con la cadena CSV y el tipo MIME adecuado
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a'); // Crea un elemento <a> temporal

        // Verifica si el navegador soporta el atributo 'download'
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob); // Crea una URL de objeto para el Blob
            link.setAttribute('href', url);
            link.setAttribute('download', filename); // Establece el nombre del archivo
            link.style.visibility = 'hidden'; // Oculta el enlace
            document.body.appendChild(link); // Añade el enlace al DOM
            link.click(); // Simula un clic en el enlace para iniciar la descarga
            document.body.removeChild(link); // Elimina el enlace del DOM
            URL.revokeObjectURL(url); // Libera la URL del objeto Blob
        } else {
            // Fallback para navegadores antiguos que no soportan el atributo 'download'
            // No usamos alert() aquí, sino un modal personalizado si es necesario.
            console.warn('Tu navegador no soporta la descarga directa. CSV generado en consola.');
            console.log(csvString); // Muestra el CSV en la consola para que el usuario lo copie
        }
    };

    // --- Lógica de envío de formularios (ahora con exportación integrada) ---
    const forms = document.querySelectorAll('.pers-forms .tab-content');
    forms.forEach(formContent => {
        const submitButton = formContent.querySelector('.submit-button');

        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();

                // 1. Recopilar datos de la pestaña actual
                const currentTabData = {};
                formContent.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.name) { // Asegúrate de que el input tenga un atributo 'name'
                        if (input.type === 'checkbox') {
                            currentTabData[input.name] = input.checked ? 'Sí' : 'No';
                        } else {
                            currentTabData[input.name] = input.value;
                        }
                    }
                });
                console.log(`Datos de la pestaña ${formContent.id} (guardado simulado):`, currentTabData);

                // 2. Mostrar mensaje de confirmación (modal)
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

    // --- Cálculo de edad para el campo de fecha de nacimiento (ya existente) ---
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
