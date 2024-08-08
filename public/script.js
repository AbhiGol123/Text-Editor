document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');

    // Function to check if all required fields are filled
    function checkFormValidity() {
        const port = document.getElementById('port').value.trim();
        const server_name = document.getElementById('server_name').value.trim();
        const ssl_certificate = document.getElementById('ssl_certificate').value.trim();
        const ssl_certificate_key = document.getElementById('ssl_certificate_key').value.trim();
        const root = document.getElementById('root').value.trim();
        const index = document.getElementById('index').value.trim();
        const proxy_location = document.getElementById('proxy_location').value.trim();
        const proxy_pass = document.getElementById('proxy_pass').value.trim();
        const error_page_404 = document.getElementById('error_page_404').value.trim();
        const error_page_50x = document.getElementById('error_page_50x').value.trim();

        // Enable the save button only if all fields are filled
        saveButton.disabled = !(port || server_name || ssl_certificate || ssl_certificate_key || root || index || proxy_location || proxy_pass || error_page_404 || error_page_50x);
    }

    // Event listeners to check form validity on input change
    document.getElementById('port').addEventListener('input', checkFormValidity);
    document.getElementById('server_name').addEventListener('input', checkFormValidity);
    document.getElementById('ssl_certificate').addEventListener('input', checkFormValidity);
    document.getElementById('ssl_certificate_key').addEventListener('input', checkFormValidity);
    document.getElementById('root').addEventListener('input', checkFormValidity);
    document.getElementById('index').addEventListener('input', checkFormValidity);
    document.getElementById('proxy_location').addEventListener('input', checkFormValidity);
    document.getElementById('proxy_pass').addEventListener('input', checkFormValidity);
    document.getElementById('error_page_404').addEventListener('input', checkFormValidity);
    document.getElementById('error_page_50x').addEventListener('input', checkFormValidity);

    // Save button click handler
    saveButton.addEventListener('click', function() {
        // Check form validity before proceeding
        checkFormValidity();
        if (saveButton.disabled) {
            alert('Please fill out required fields before submitting.');
            return;
        }

        const port = document.getElementById('port').value;
        const server_name = document.getElementById('server_name').value;
        const ssl_certificate = document.getElementById('ssl_certificate').value;
        const ssl_certificate_key = document.getElementById('ssl_certificate_key').value;
        const ssl_protocols = document.getElementById('ssl_protocols').value;
        const ssl_ciphers = document.getElementById('ssl_ciphers').value;
        const ssl_prefer_server_ciphers = document.getElementById('ssl_prefer_server_ciphers').value;
        const root = document.getElementById('root').value;
        const index = document.getElementById('index').value;
        const proxy_location = document.getElementById('proxy_location').value;
        const proxy_pass = document.getElementById('proxy_pass').value;
        const error_page_404 = document.getElementById('error_page_404').value;
        const error_page_50x = document.getElementById('error_page_50x').value;
        const static_files_types = document.getElementById('static_files_types').value;
        const static_files_expires = document.getElementById('static_files_expires').value;
        const static_files_headers = document.getElementById('static_files_headers').value;
        const hidden_files = document.getElementById('hidden_files').value;
        const deny_hidden_files = document.getElementById('deny_hidden_files').value;


        // Create the data to be sent
        const data = {
            port,
            server_name,
            ssl_certificate,
            ssl_certificate_key,
            ssl_protocols,
            ssl_ciphers,
            ssl_prefer_server_ciphers,
            root,
            index,
            proxy_location,
            proxy_pass,
            error_page_404,
            error_page_50x,
            static_files_types,
            static_files_expires,
            static_files_headers,
            hidden_files,
            deny_hidden_files
        };

        fetch('/save-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error('Error:', error));
    });
});
