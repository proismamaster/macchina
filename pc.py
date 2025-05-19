from flask import Flask, render_template, request #libreria flask per fare webapp
import bluetooth #libreria per bluetooth

app=Flask(__name__) #creo un instanza dell'app Flask

macRasberry="D8:3A:DD:60:BE:C8" #indirizzo MAC del rasberry PI su cui gira il server bluetooth
portaRasberry=1 #porta server bluetooth

sock=bluetooth.BluetoothSocket(bluetooth.RFCOMM)
sock.connect((macRasberry, portaRasberry))

@app.route('/', methods=['POST','GET']) #root del sito
def index():
    if request.method=='POST':
        comando=request.json['comando'] #estraggo dal campo comando il suo valore e lo memorizzo nella variabile
        try:
            sock.send(comando)
        except Exception as  e:
            print(f"Errore nella connesione: {e} \n")
            return f"Errore: {e}"
    return render_template('index.html') #viene caricato index.htiml
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

   