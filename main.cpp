#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <MAX30100_PulseOximeter.h>

// Credenciais Wi-Fi
const char* ssid = "me usa me abusa";
const char* password = "12345673";

// Criação de um servidor na porta 80
WebServer server(80);

// Definindo o sensor MAX30100
MAX30100_PulseOximeter pox;
uint32_t ts = 0;  // Timestamp para atualização

// Variáveis de controle dos dados
int bpm = 0; // Batimentos cardíacos medidos
float spo2 = 0; // Saturação de oxigênio (spo2)

void setup() {
  Serial.begin(115200);

  // Inicializa o sensor MAX30100
  if (!pox.begin()) {
    Serial.println("Falha ao inicializar o sensor MAX30100!");
    while (1);
  }

  // Configuração do Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando-se ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi");

  // Definir a rota do servidor
  server.on("/", HTTP_GET, handleRoot);

  // Inicia o servidor web
  server.begin();
}

void handleRoot() {
  // Envia a frequência cardíaca e a saturação de oxigênio para o cliente
  String response = "BPM: " + String(bpm) + "\nSpO2: " + String(spo2);
  if (bpm < 60) {
    response += "\nSono Detectado!";
  } else {
    response += "\nBatimentos OK!";
  }
  server.send(200, "text/plain", response);  // Envia os dados como resposta
}

void loop() {
  // Atualiza os dados do sensor a cada 1000ms
  unsigned long now = millis();
  if (now - ts > 1000) {
    ts = now;

    // Atualiza as leituras do sensor
    pox.update();

    // Lê os valores de BPM e SpO2 do sensor MAX30100
    bpm = pox.getHeartRate();
    spo2 = pox.getSpO2();

    // Exibe os dados no monitor serial
    Serial.print("BPM: ");
    Serial.print(bpm);
    Serial.print(" SpO2: ");
    Serial.println(spo2);
  }

  // Lida com requisições do cliente
  server.handleClient();
}
