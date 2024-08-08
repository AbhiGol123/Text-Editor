const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;
const CONFIG_FILE_PATH = path.join('/usr/local/etc/nginx/nginx.conf');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/save-config', (req, res) => {
    const {
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
        deny_hidden_files,
    } = req.body;

    if (!port || !server_name || !ssl_certificate || !ssl_certificate_key || !root || !index || !proxy_location || !proxy_pass || !error_page_404 || !error_page_50x) {
        return res.status(400).send('Please fill the required fields.');
    }

    // Generate content for nginx.conf
    const content = `
http {
    server {
    listen ${port};
    server_name ${server_name};

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name ${server_name};

        # SSL Configuration
        ssl_certificate ${ssl_certificate};
        ssl_certificate_key ${ssl_certificate_key};

        ssl_protocols ${ssl_protocols? ssl_protocols:'TLSv1.2 TLSv1.3'};
        ssl_ciphers ${ssl_ciphers? ssl_ciphers:'HIGH:!aNULL:!MD5'};
        ssl_prefer_server_ciphers ${ssl_prefer_server_ciphers? ssl_prefer_server_ciphers:'on'};

        # Security Headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";

        # Root and Index
        root ${root};
        index ${index};

        # Location Blocks
        location / {
            try_files $uri $uri/ =404;
        }

        # Reverse Proxy Example
        location /${proxy_location} {
            proxy_pass ${proxy_pass};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Error Pages
        error_page 404 /404.html;
        location = /404.html {
            root ${error_page_404}
            internal;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root ${error_page_50x};
            internal;
        }

        # Static Files Caching
        location ~* \\.(${static_files_types? static_files_types:'jpg|jpeg|png|gif|ico|css|js'})$ {
            expires ${static_files_expires? static_files_expires:7}d;
            add_header Cache-Control "${static_files_headers? static_files_headers:'public, no-transform'}";
        }

        # Deny Access to Hidden Files
        location ~ /\\.${hidden_files? hidden_files:'ht'} {
            deny ${deny_hidden_files? deny_hidden_files:'all'};
        }
    }
}
events { }
    `.trim();

    fs.writeFile(CONFIG_FILE_PATH, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Failed to save the file.');
        }
        res.send('File saved successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
