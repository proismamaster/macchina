import io
import threading
from flask import Flask, Response, render_template_string
from picamera2 import Picamera2
from PIL import Image

app = Flask(__name__)

# HTML template for streaming page
template = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>PiCam3 Live Stream</title>
  </head>
  <body>
    <h1>Live Camera Stream</h1>
    <img src="{{ url_for('video_feed') }}" width="640" height="480">
  </body>
</html>
"""

# Initialize Picamera2
info = Picamera2.global_camera_info()
if not info:
    raise RuntimeError("Nessuna fotocamera rilevata! Controlla connessioni e driver.")
# Usa la prima camera disponibile
picam2 = Picamera2(camera_num=0)

# Configure camera for video streaming
camera_config = picam2.create_video_configuration(
    main={'format': 'RGB888', 'size': (640, 480)}
)
picam2.configure(camera_config)
picam2.start()

# Frame generator
def generate_frames():
    stream = io.BytesIO()
    while True:
        stream.seek(0)
        stream.truncate()
        # Capture request
        request = picam2.capture_request()
        # Get array from 'main' stream
        array = request.make_array('main')
        # Convert to JPEG
        img = Image.fromarray(array)
        img.save(stream, 'JPEG')
        request.release()
        # Yield frame
        frame = stream.getvalue()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template_string(template)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Run Flask app on all interfaces, port 5000
    app.run(host='0.0.0.0', port=5000, threaded=True)



