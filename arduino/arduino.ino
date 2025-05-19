// Controllo Motore 1 (Modulo 1)
const int in1Motore1 = 8;
const int in2Motore1 = 9;

// Controllo Motore 2 (Modulo 1)
const int in3Motore2 = 2;
const int in4Motore2 = 3;

// Controllo Motore 3 (Modulo 2)
const int in1Motore3 = 4;
const int in2Motore3 = 5;

// Controllo Motore 4 (Modulo 2)
const int in3Motore4 = 6;
const int in4Motore4 = 7;

void setup() {
  // Imposta i pin di controllo come uscite
  pinMode(in1Motore1, OUTPUT);
  pinMode(in2Motore1, OUTPUT);
  pinMode(in3Motore2, OUTPUT);
  pinMode(in4Motore2, OUTPUT);
  pinMode(in1Motore3, OUTPUT);
  pinMode(in2Motore3, OUTPUT);
  pinMode(in3Motore4, OUTPUT);
  pinMode(in4Motore4, OUTPUT);

  // Inizializza la comunicazione seriale
  Serial.begin(9600);
  Serial.println("Controllo motori seriale");
}

void loop() {
  if (Serial.available() > 0) {
    char comando = Serial.read();
    char c;

    if (comando == 'w') {
      Serial.println("Tutti i motori in senso orario (avanti)");
      // Tutti avanti
      digitalWrite(in1Motore1, HIGH); digitalWrite(in2Motore1, LOW);
      digitalWrite(in3Motore2, HIGH); digitalWrite(in4Motore2, LOW);
      digitalWrite(in1Motore3, HIGH); digitalWrite(in2Motore3, LOW);
      digitalWrite(in3Motore4, HIGH); digitalWrite(in4Motore4, LOW);

    } else if (comando == 's') {
      Serial.println("Tutti i motori in senso antiorario (indietro)");
      // Tutti indietro
      digitalWrite(in1Motore1, LOW); digitalWrite(in2Motore1, HIGH);
      digitalWrite(in3Motore2, LOW); digitalWrite(in4Motore2, HIGH);
      digitalWrite(in1Motore3, LOW); digitalWrite(in2Motore3, HIGH);
      digitalWrite(in3Motore4, LOW); digitalWrite(in4Motore4, HIGH);

    } else if (comando == 'a') {
      Serial.println("Rotazione a sinistra (pivot)");
      // Lato sinistro indietro
      digitalWrite(in1Motore1, LOW); digitalWrite(in2Motore1, HIGH);
      digitalWrite(in1Motore3, LOW); digitalWrite(in2Motore3, HIGH);
      // Lato destro avanti
      digitalWrite(in3Motore2, HIGH); digitalWrite(in4Motore2, LOW);
      digitalWrite(in3Motore4, HIGH); digitalWrite(in4Motore4, LOW);

    } else if (comando == 'd') {
      Serial.println("Rotazione a destra (pivot)");
      // Lato sinistro avanti
      digitalWrite(in1Motore1, HIGH); digitalWrite(in2Motore1, LOW);
      digitalWrite(in1Motore3, HIGH); digitalWrite(in2Motore3, LOW);
      // Lato destro indietro
      digitalWrite(in3Motore2, LOW); digitalWrite(in4Motore2, HIGH);
      digitalWrite(in3Motore4, LOW); digitalWrite(in4Motore4, HIGH);

    } else {
      Serial.println("Comando non valido. Invia 'w', 's', 'a' o 'd'.");
      // Ferma tutti i motori
      digitalWrite(in1Motore1, LOW); digitalWrite(in2Motore1, LOW);
      digitalWrite(in3Motore2, LOW); digitalWrite(in4Motore2, LOW);
      digitalWrite(in1Motore3, LOW); digitalWrite(in2Motore3, LOW);
      digitalWrite(in3Motore4, LOW); digitalWrite(in4Motore4, LOW);
    }

    delay(100); // Piccolo ritardo
    while (Serial.available() > 0) { c = Serial.read(); }

  } else {
    // Se non ci sono comandi, ferma tutti i motori
    digitalWrite(in1Motore1, LOW); digitalWrite(in2Motore1, LOW);
    digitalWrite(in3Motore2, LOW); digitalWrite(in4Motore2, LOW);
    digitalWrite(in1Motore3, LOW); digitalWrite(in2Motore3, LOW);
    digitalWrite(in3Motore4, LOW); digitalWrite(in4Motore4, LOW);
  }
}
