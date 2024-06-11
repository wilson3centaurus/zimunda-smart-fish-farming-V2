from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

app = Flask(__name__)

# Relay pin configuration
pump1_pin = 21  # Water inlet
pump2_pin = 26  # Water outlet

# Set the GPIO mode to BCM
GPIO.setmode(GPIO.BCM)

# Set up GPIO pins for relays
GPIO.setup(pump1_pin, GPIO.OUT)
GPIO.setup(pump2_pin, GPIO.OUT)

@app.route('/control_pump', methods=['POST'])
def control_pump():
    data = request.json
    pump = data.get('pump')
    state = data.get('state')

    if pump == 'pump1':
        GPIO.output(pump1_pin, GPIO.HIGH if state == 'on' else GPIO.LOW)
    elif pump == 'pump2':
        GPIO.output(pump2_pin, GPIO.HIGH if state == 'on' else GPIO.LOW)
    
    return jsonify({"status": "success", "pump": pump, "state": state})

@app.route('/status', methods=['GET'])
def status():
    pump1_state = GPIO.input(pump1_pin)
    pump2_state = GPIO.input(pump2_pin)
    return jsonify({
        "pump1": "on" if pump1_state == GPIO.HIGH else "off",
        "pump2": "on" if pump2_state == GPIO.HIGH else "off"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
