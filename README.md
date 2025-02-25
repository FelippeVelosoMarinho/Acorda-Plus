# Acorda Plus

### Circuito
![image](https://github.com/user-attachments/assets/2500ec8b-fb82-4eb0-847b-49a04c1c8c18)

### Código do Circuito de Teste
```

#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "me usa me abusa";
const char* password = "12345673";

// Criação de um servidor na porta 80
WebServer server(80);

int bpm = 75;  // Batimentos cardíacos simulados

// Função que será chamada quando a requisição for feita
void handleRoot() {
  // Simula a detecção de sonolência
  if (bpm < 60) {
    server.send(200, "text/plain", "sono_detectado");  // Envia "sono_detectado" quando batimentos estão baixos
  } else {
    server.send(200, "text/plain", "batimentos_ok");  // Caso contrário, envia "batimentos_ok"
  }
}

void setup() {
  Serial.begin(115200);

  // Conectando-se ao Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando-se ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi");

  // Definindo a rota para o servidor web
  server.on("/", HTTP_GET, handleRoot);

  // Inicia o servidor
  server.begin();
}

void loop() {
  server.handleClient();  // Lida com requisições do cliente
  bpm -= 1;  // Simula a redução dos batimentos cardíacos (para detectar sonolência)
  delay(1000);  // Atraso de 1 segundo
}

```

### Preview do Aplicativo
![Imagem do WhatsApp de 2025-02-20 à(s) 17 23 56_07b2fc56](https://github.com/user-attachments/assets/f652993b-f4ff-44aa-9e1e-a73d1cbefdf1)
