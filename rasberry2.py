import bluetooth
import serial

porta = 1  # La porta in cui assocerò la connessione Bluetooth
portaVirtuale = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
portaVirtuale.bind(("", porta))              # Associo la porta del Raspberry
portaVirtuale.listen(1)                     # Può accettare una sola connessione alla volta

arduino = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)  # Apro la porta seriale per comunicare con Arduino

while True:
    try:
        print("In attesa di connessioni...\n")
        client_sock, client_info = portaVirtuale.accept()  # Attende una connessione (bloccante)
        print(f"Connessione stabilita da: {client_info[0]}")

        # Ora gestiamo i dati ricevuti dal client
        while True:
            data = client_sock.recv(1024)  # Riceve fino a 1024 byte dal client
            if not data:  # Se non ricevo dati, il client si è disconnesso
                print("Client disconnesso normalmente")
                break
            comando = data.decode('utf-8').strip()  # Decodifico il comando ricevuto
            arduino.write(comando.encode('utf-8'))  # Lo invio ad Arduino
            print(f"Comando ricevuto: {comando}")

    except bluetooth.btcommon.BluetoothError as e:  # Errore nella connessione Bluetooth
        print(f"Errore nella connessione Bluetooth: {e}\n")
    except KeyboardInterrupt:  # Se il server viene interrotto manualmente
        print("Server interrotto manualmente.\n")
        exit()
    except Exception as e:
        print(f"Errore generico: {e}\n")
    finally:
        # Chiudo il socket del client, indipendentemente dalla presenza di errori
        try:
            client_sock.close()
        except:
            pass

# Chiudo il socket del server
portaVirtuale.close()
