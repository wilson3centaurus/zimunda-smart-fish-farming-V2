from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

app = Flask(__name__)

# Setup GPIO
GPIO.setmode(GPIO.BCM)
INLET_PUMP_PIN = 21
OUTLET_PUMP_PIN = 26
GPIO.setup(INLET_PUMP_PIN, GPIO.OUT)
GPIO.setup(OUTLET_PUMP_PIN, GPIO.OUT)

@app.route('/control-pump', methods=['POST'])
def control_pump():
    data = request.get_json()
    pump = data.get('pump')
    action = data.get('action')

    if pump == 'inlet':
        if action == 'on':
            GPIO.output(INLET_PUMP_PIN, GPIO.HIGH)
        elif action == 'off':
            GPIO.output(INLET_PUMP_PIN, GPIO.LOW)
    elif pump == 'outlet':
        if action == 'on':
            GPIO.output(OUTLET_PUMP_PIN, GPIO.HIGH)
        elif action == 'off':
            GPIO.output(OUTLET_PUMP_PIN, GPIO.LOW)

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        GPIO.cleanup()
