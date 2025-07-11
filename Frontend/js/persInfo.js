let beneficiaryCount = 0;

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

function initDatosPersonalesLogic() {
    console.log("[persInfo.js] Inicializando lógica de Datos Personales.");
    const birthDateInput = document.getElementById('fechaNacimiento');
    const ageInput = document.getElementById('edad');

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
        } else if (ageInput) {
            ageInput.value = '';
        }
    };

    if (birthDateInput) {
        birthDateInput.removeEventListener('change', calculateAge);
        birthDateInput.addEventListener('change', calculateAge);
        calculateAge();
    }

    setupFormSubmission('datos-personales');
}

function initAdicionalBeneficiariosLogic() {
    console.log("[persInfo.js] Inicializando lógica de beneficiarios.");

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

    document.querySelectorAll('#beneficiarios-container .delete-beneficiary-btn').forEach(button => {
        button.removeEventListener('click', handleDeleteBeneficiary); // Prevenir duplicados
        button.addEventListener('click', handleDeleteBeneficiary);
    });
    console.log("[persInfo.js] Listeners para 'Eliminar Beneficiario' adjuntados.");

    setupFormSubmission('adicional-beneficiarios');
}

function handleAddBeneficiary() {
    console.log("[persInfo.js] Clic en Añadir Beneficiario.");
    beneficiaryCount++;
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
    } else {
        console.warn("[persInfo.js] No se encontró la entrada del beneficiario a eliminar.");
    }
}

function setupFormSubmission(formContentId) {
    const formContent = document.getElementById(formContentId);
    if (!formContent) {
        console.warn(`[persInfo.js] No se encontró el contenido del formulario para ID: ${formContentId}`);
        return;
    }

    const form = formContent.querySelector('form');
    if (!form) {
        console.warn(`[persInfo.js] No se encontró un formulario dentro del contenido de la pestaña: ${formContentId}`);
        return;
    }

    // Remover listeners anteriores para evitar duplicados
    form.removeEventListener('submit', handleSubmitForm);
    form.addEventListener('submit', handleSubmitForm);

    function handleSubmitForm(event) {
        event.preventDefault();

        console.log(`[persInfo.js] Formulario de ${formContentId} enviado.`);

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
window.initPersInfoLogic = (activeTabId) => {
    console.log(`[persInfo.js] initPersInfoLogic llamado para la pestaña: ${activeTabId}`);

    if (activeTabId === 'datos-personales') {
        initDatosPersonalesLogic();
    } else if (activeTabId === 'contacto-domicilio') {
        setupFormSubmission('contacto-domicilio');
    } else if (activeTabId === 'datos-laborales') {
        setupFormSubmission('datos-laborales');
    } else if (activeTabId === 'informacion-salarial') {
        setupFormSubmission('informacion-salarial');
    } else if (activeTabId === 'seguridad-social-bancarios') {
        setupFormSubmission('seguridad-social-bancarios');
    } else if (activeTabId === 'adicional-beneficiarios') {
        initAdicionalBeneficiariosLogic();
    }
};
