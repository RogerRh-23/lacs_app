// js/persInfo.js

// Contador de beneficiarios (global para este script, se reinicia al cargar la pestaña)
let beneficiaryCount = 0;

// Re-definiendo showMessageModal para que sea global y accesible
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

// --- Lógica para la pestaña 'datos-personales' ---
function initDatosPersonalesLogic() {
    console.log("[persInfo.js] Inicializando lógica de Datos Personales.");
    const birthDateInput = document.getElementById('fechaNacimiento'); // Usar ID del HTML proporcionado
    const ageInput = document.getElementById('edad'); // Usar ID del HTML proporcionado

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
            // La clase 'is-active' para la etiqueta flotante se maneja con CSS :placeholder-shown y :focus
        } else if (ageInput) {
            ageInput.value = '';
            // La clase 'is-active' para la etiqueta flotante se maneja con CSS :placeholder-shown y :focus
        }
    };

    if (birthDateInput) {
        birthDateInput.removeEventListener('change', calculateAge); // Evitar duplicados
        birthDateInput.addEventListener('change', calculateAge);
        calculateAge(); // Calcular la edad al cargar si ya hay un valor
    }

    // Configurar el envío del formulario para esta pestaña
    setupFormSubmission('datos-personales');
}

// --- Lógica para la pestaña 'adicional-beneficiarios' ---
function initAdicionalBeneficiariosLogic() {
    console.log("[persInfo.js] Inicializando lógica de beneficiarios.");

    // Re-inicializar beneficiaryCount basado en los elementos actuales en el DOM
    beneficiaryCount = document.querySelectorAll('#beneficiarios-container .beneficiary-entry').length;
    console.log(`[persInfo.js] Beneficiarios existentes en el DOM al inicializar: ${beneficiaryCount}`);

    const addBeneficiaryBtn = document.getElementById('add-beneficiary-btn');
    const beneficiariesContainer = document.getElementById('beneficiarios-container');

    if (addBeneficiaryBtn && beneficiariesContainer) {
        addBeneficiaryBtn.removeEventListener('click', handleAddBeneficiary); // Prevenir duplicados
        addBeneficiaryBtn.addEventListener('click', handleAddBeneficiary);
        console.log("[persInfo.js] Listener para 'Añadir Beneficiario' adjuntado.");
    } else {
        console.warn("[persInfo.js] Botón 'Añadir Beneficiario' o contenedor no encontrado para beneficiarios.");
    }

    // Adjuntar/re-adjuntar listeners para todos los botones de eliminar existentes
    document.querySelectorAll('#beneficiarios-container .delete-beneficiary-btn').forEach(button => {
        button.removeEventListener('click', handleDeleteBeneficiary); // Prevenir duplicados
        button.addEventListener('click', handleDeleteBeneficiary);
    });
    console.log("[persInfo.js] Listeners para 'Eliminar Beneficiario' adjuntados.");

    // Configurar el envío del formulario para esta pestaña (si tiene uno en el fragmento)
    setupFormSubmission('adicional-beneficiarios');
}

// Función para manejar la adición de un beneficiario
function handleAddBeneficiary() {
    console.log("[persInfo.js] Clic en Añadir Beneficiario.");
    beneficiaryCount++; // Usar un contador para IDs/nombres únicos
    const newBeneficiaryHtml = `
        <div class="beneficiary-entry">
            <div class="form-row">
                <div class="input-group">
                    <div class="relative">
                        <i class="fas fa-users"></i>
                        <input type="text" id="beneficiarioNombre${beneficiaryCount}" name="beneficiarioNombre${beneficiaryCount}" placeholder=" " required>
                    </div>
                    <label for="beneficiarioNombre${beneficiaryCount}" class="input-label">Nombre Completo del Beneficiario(s):</label>
                </div>
                <div class="input-group">
                    <div class="relative">
                        <i class="fas fa-percent"></i>
                        <input type="number" id="beneficiarioPorcentaje${beneficiaryCount}" name="beneficiarioPorcentaje${beneficiaryCount}" placeholder=" " required>
                    </div>
                    <label for="beneficiarioPorcentaje${beneficiaryCount}" class="input-label">Porcentaje del Beneficiario:</label>
                </div>
            </div>
            <div class="delete-button-container">
                <button type="button" class="delete-beneficiary-btn"><i class="fas fa-trash-alt"></i> Eliminar</button>
            </div>
        </div>
    `;
    const beneficiariesContainer = document.getElementById('beneficiarios-container');
    if (beneficiariesContainer) {
        beneficiariesContainer.insertAdjacentHTML('beforeend', newBeneficiaryHtml);
        // Re-adjuntar listeners para el nuevo botón de eliminar
        document.querySelectorAll('#beneficiarios-container .delete-beneficiary-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteBeneficiary);
            button.addEventListener('click', handleDeleteBeneficiary);
        });
        console.log(`[persInfo.js] Nuevo beneficiario añadido. Total: ${beneficiaryCount}`);
    } else {
        console.error("[persInfo.js] Contenedor de beneficiarios no encontrado para añadir nuevo.");
    }
}

// Función para manejar la eliminación de un beneficiario
function handleDeleteBeneficiary(event) {
    console.log("[persInfo.js] Clic en Eliminar Beneficiario.");
    const entry = event.target.closest('.beneficiary-entry');
    if (entry) {
        entry.remove();
        console.log("[persInfo.js] Beneficiario eliminado.");
        // No es necesario decrementar beneficiaryCount, ya que solo lo usamos para IDs únicos
        // y se re-inicializa al cargar la pestaña.
    } else {
        console.warn("[persInfo.js] No se encontró la entrada del beneficiario a eliminar.");
    }
}

// --- Lógica genérica de envío de formularios ---
function setupFormSubmission(formContentId) {
    const formContent = document.getElementById(formContentId);
    if (!formContent) {
        console.warn(`[persInfo.js] No se encontró el contenido del formulario para ID: ${formContentId}`);
        return;
    }

    const form = formContent.querySelector('form'); // Busca el formulario dentro del contenido de la pestaña
    if (!form) {
        console.warn(`[persInfo.js] No se encontró un formulario dentro del contenido de la pestaña: ${formContentId}`);
        return;
    }

    // Remover listeners anteriores para evitar duplicados
    form.removeEventListener('submit', handleSubmitForm);
    form.addEventListener('submit', handleSubmitForm);

    function handleSubmitForm(event) {
        event.preventDefault(); // Previene el envío por defecto del formulario

        console.log(`[persInfo.js] Formulario de ${formContentId} enviado.`);

        // Recolectar datos del formulario actual
        const currentTabData = {};
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    currentTabData[input.name] = input.checked ? 'Sí' : 'No';
                } else {
                    currentTabData[input.name] = input.value;
                }
            }
        });
        console.log(`Datos de la pestaña ${formContent.id} (guardado simulado):`, currentTabData);

        // Aquí es donde enviarías los datos al backend
        // fetch('/api/guardar-datos', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(currentTabData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Respuesta del backend:', data);
        //     showMessageModal(`Datos de ${formContent.id} guardados con éxito.`);
        // })
        // .catch(error => {
        //     console.error('Error al guardar datos:', error);
        //     showMessageModal(`Error al guardar datos de ${formContent.id}.`);
        // });

        showMessageModal(`Datos de ${formContent.id} guardados (simulado).`);
    }
}


// --- Función principal de inicialización para persInfo.js ---
// Esta función será el punto de entrada llamado por persInfoTabLoader.js
window.initPersInfoLogic = (activeTabId) => {
    console.log(`[persInfo.js] initPersInfoLogic llamado para la pestaña: ${activeTabId}`);

    // Llama a la lógica específica para cada pestaña
    if (activeTabId === 'datos-personales') {
        initDatosPersonalesLogic();
    } else if (activeTabId === 'contacto-domicilio') {
        // Si tienes lógica específica para esta pestaña, créala aquí:
        // initContactoDomicilioLogic();
        setupFormSubmission('contacto-domicilio');
    } else if (activeTabId === 'datos-laborales') {
        // initDatosLaboralesLogic();
        setupFormSubmission('datos-laborales');
    } else if (activeTabId === 'informacion-salarial') {
        // initInformacionSalarialLogic();
        setupFormSubmission('informacion-salarial');
    } else if (activeTabId === 'seguridad-social-bancarios') {
        // initSeguridadSocialBancariosLogic();
        setupFormSubmission('seguridad-social-bancarios');
    } else if (activeTabId === 'adicional-beneficiarios') {
        initAdicionalBeneficiariosLogic();
        // La lógica de envío de formulario para esta pestaña ya está en initAdicionalBeneficiariosLogic
        // si el formulario de Información Médica está dentro del mismo fragmento.
        // Si tienes un form separado para beneficiarios, también llama a setupFormSubmission('id-del-form-beneficiarios');
    }
    // Asegúrate de llamar a setupFormSubmission para cada pestaña que contenga un formulario
    // si no lo haces dentro de su función initXLogic específica.
};
