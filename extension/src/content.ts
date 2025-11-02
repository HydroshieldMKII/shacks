// Content script qui s'injecte dans les pages web pour l'auto-complétion

// Fonction pour détecter si un champ est un champ de nom d'utilisateur
function isUsernameField(input: HTMLInputElement): boolean {
    const name = input.name?.toLowerCase() || '';
    const id = input.id?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const type = input.type?.toLowerCase() || '';
    const autocomplete = input.autocomplete?.toLowerCase() || '';
    const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';
    const className = input.className?.toLowerCase() || '';
    const dataTestId = input.getAttribute('data-testid')?.toLowerCase() || '';
    const dataTest = input.getAttribute('data-test')?.toLowerCase() || '';
    
    // Vérifier tous les attributs data-*
    const allDataAttrs = Array.from(input.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => attr.value?.toLowerCase() || '')
        .join(' ');

    const usernameKeywords = [
        'user', 'login', 'email', 'account', 'username', 
        'mail', 'identifier', 'id', 'signin', 'sign-in', 'log-in',
        'courriel', 'utilisateur', 'identifiant'
    ];
    
    const allText = `${name} ${id} ${placeholder} ${ariaLabel} ${className} ${dataTestId} ${dataTest} ${allDataAttrs}`;
    
    return (
        type === 'email' ||
        (type === 'text' || type === '') && (
            autocomplete === 'username' ||
            autocomplete === 'email' ||
            autocomplete.includes('username') ||
            autocomplete.includes('email') ||
            usernameKeywords.some(keyword => allText.includes(keyword))
        )
    );
}

// Fonction pour détecter si un champ est un champ de mot de passe
function isPasswordField(input: HTMLInputElement): boolean {
    return input.type === 'password';
}



// Fonction pour trouver tous les inputs (incluant shadow DOM et iframes)
function getAllInputs(): HTMLInputElement[] {
    const inputs: HTMLInputElement[] = [];
    
    // Inputs du document principal
    inputs.push(...Array.from(document.querySelectorAll<HTMLInputElement>('input')));
    
    // Chercher dans les shadow roots
    const elementsWithShadow = document.querySelectorAll('*');
    elementsWithShadow.forEach(element => {
        if (element.shadowRoot) {
            const shadowInputs = element.shadowRoot.querySelectorAll<HTMLInputElement>('input');
            inputs.push(...Array.from(shadowInputs));
        }
    });
    
    // Chercher dans les iframes accessibles
    try {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    const iframeInputs = iframe.contentDocument.querySelectorAll<HTMLInputElement>('input');
                    inputs.push(...Array.from(iframeInputs));
                }
            } catch (e) {
                // Iframe cross-origin, on ne peut pas y accéder
                console.log('Trust: Cannot access iframe due to CORS');
            }
        });
    } catch (e) {
        console.log('Trust: Error accessing iframes:', e);
    }
    
    return inputs;
}

// Fonction pour remplir le formulaire de connexion
function fillLoginForm(password: any): boolean {
    // Trouver les champs username et password dans la page
    const inputs = getAllInputs();
    
    let usernameField = inputs.find(input => isUsernameField(input));
    let passwordField = inputs.find(input => isPasswordField(input));

    // Fallback: si on trouve un champ password mais pas de username
    // Chercher le premier champ text visible avant le password
    if (passwordField && !usernameField) {
        const passwordIndex = inputs.indexOf(passwordField);
        usernameField = inputs
            .slice(0, passwordIndex)
            .reverse()
            .find(input => 
                (input.type === 'text' || input.type === 'email') && 
                input.offsetParent !== null // est visible
            );
    }

    // Fallback 2: Si on ne trouve toujours rien, chercher le premier text et password visibles
    if (!usernameField || !passwordField) {
        const visibleInputs = inputs.filter(input => input.offsetParent !== null);
        if (!usernameField) {
            usernameField = visibleInputs.find(input => 
                input.type === 'text' || input.type === 'email'
            );
        }
        if (!passwordField) {
            passwordField = visibleInputs.find(input => input.type === 'password');
        }
    }

    let filledAny = false;

    // Remplir les champs
    if (usernameField && password.username) {
        usernameField.value = password.username;
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
        usernameField.dispatchEvent(new Event('change', { bubbles: true }));
        filledAny = true;
    }

    // Remplir le mot de passe directement (déjà déchiffré dans l'extension)
    if (passwordField && password.password) {
        passwordField.value = password.password;
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
        passwordField.dispatchEvent(new Event('change', { bubbles: true }));
        filledAny = true;
    }

    return filledAny;
}

// Écouter les messages de l'extension (pour le bouton auto-fill)
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'fillForm' && request.data) {
        // Attendre un peu si la page n'est pas complètement chargée
        if (document.readyState !== 'complete') {
            setTimeout(() => {
                const success = fillLoginForm(request.data);
                sendResponse({ success });
            }, 1000);
            return true;
        } else {
            const success = fillLoginForm(request.data);
            sendResponse({ success });
            return true;
        }
    }
});


