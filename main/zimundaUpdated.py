import os
import glob
import time
from datetime import datetime
import pyrebase
import RPi.GPIO as GPIO
import Adafruit_ADS1x15

# Firebase configuration
firebaseConfig = {
    "apiKey": "AIzaSyDnG1Kr_vUrdoVcE2SAbzEiG-tBPSe6-kw",
    "authDomain": "zimunda-sensor-data.firebaseapp.com",
    "databaseURL": "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
    "projectId": "zimunda-sensor-data",
    "storageBucket": "zimunda-sensor-data.appspot.com",
    "messagingSenderId": "260289735455",
    "appId": "1:260289735455:web:c70d169bc8b86945cb1e2a",
    "measurementId": "G-WFH79MCPNP"
}

# Initialize Firebase app
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

# Define sensor pin
sensor_pin = 10

# Set up GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor_pin, GPIO.IN)  # Set sensor pin as input

# Relay pin configuration
pump1_pin = 21  # Water inlet
pump2_pin = 26  # Water outlet

# Set the GPIO mode to BCM
GPIO.setmode(GPIO.BCM)

# Set up GPIO pins for relays
GPIO.setup(pump1_pin, GPIO.OUT)
GPIO.setup(pump2_pin, GPIO.OUT)

def read_temp_raw():
    try:
        with open(device_file, 'r') as f:
            lines = f.readlines()
        return lines
    except FileNotFoundError:
        print("Error: Temperature sensor file not found.")
        return None

def read_temp():
    lines = read_temp_raw()
    if lines is None:
        return None  # Handle sensor file not found

    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos + 2:]
        temp_c = float(temp_string) / 1000.0
        return temp_c
    else:
        print("Error: Could not read temperature data.")
        return None  # Handle temperature data reading error

def check_water_level():
    if GPIO.input(sensor_pin):
        return 1  # Normal water level
    else:
        return 0  # Low water level

def control_pumps():
    water_level = check_water_level()
    celsius = read_temp()

    if water_level == 0:  # Low water level
        GPIO.output(pump1_pin, GPIO.HIGH)
        GPIO.output(pump2_pin, GPIO.LOW)
        print("Pump 1 On, Pump 2 Off - Low Water Level")
    elif water_level == 1:  # Normal water level
        GPIO.output(pump1_pin, GPIO.LOW)
        GPIO.output(pump2_pin, GPIO.LOW)
        print("Both Pumps Off - Normal Water Level")

    if celsius is not None:
        if celsius <= 18 or celsius >= 30:  # Temperature out of threshold
            GPIO.output(pump1_pin, GPIO.HIGH)
            GPIO.output(pump2_pin, GPIO.HIGH)
            print("Both Pumps On - Temperature out of threshold")
        else:
            print("Temperature within normal range")

try:
    while True:
        celsius = read_temp()
        water_level = check_water_level()

        if celsius is not None:
            print(f'Temperature: {celsius:.2f}°C')
            data = {
                "temperature": celsius,
                "water_level": water_level,
                "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            db.child("sensor_data").push(data)  # Push data to the "sensor_data" node

        if water_level == 0:
            print("Water Level: Low")
        elif water_level == 1:
            print("Water Level: Normal")

        control_pumps()

        time.sleep(2)

finally:
    GPIO.cleanup()
