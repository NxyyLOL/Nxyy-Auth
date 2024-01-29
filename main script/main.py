import sys
import requests
import os
import time
from datetime import datetime, timedelta
import wmi
import mysql.connector
import json

MYSQL_CONFIG = {
    'user': 'user_username',
    'password': 'your_password',
    'host': 'your_host_name',
    'database': 'auth'
}

class Theme:
    MAGENTA = '\033[38;5;213m'
    RESET = '\033[0m'

def clear_terminal():
    os.system('cls' if os.name == 'nt' else 'clear')

def get_hwid():
    c = wmi.WMI()
    disk = c.Win32_DiskDrive()[0]
    return disk.SerialNumber

def set_expiration_time(cursor, key_type):
    current_time = get_current_time()

    if key_type == 1:
        expiration_time = current_time + timedelta(weeks=1)
    elif key_type == 2:
        expiration_time = current_time + timedelta(days=30)
    elif key_type == 3:
        expiration_time = current_time + timedelta(days=3650)

    return expiration_time

def check_key(key):
    try:
        cnx = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = cnx.cursor()

        query = "SELECT `hwid`, `type`, `expiration_time` FROM auth WHERE `key` = %s"
        cursor.execute(query, (key,))
        result = cursor.fetchone()

        if result:
            stored_hwid = result[0]
            key_type = result[1]
            expiration_time = result[2]

            if stored_hwid:
                current_hwid = get_hwid()

                if current_hwid != stored_hwid:
                    print(f"Invalid HWID.")
                    time.sleep(1.5)
                    return

            else:
                current_hwid = get_hwid()

                query = "UPDATE auth SET `hwid` = %s WHERE `key` = %s"
                cursor.execute(query, (current_hwid, key))
                cnx.commit()

                print(f"HWID set.")
                time.sleep(1.5)
                clear_terminal()

            current_time = get_current_time()
            if expiration_time and current_time > expiration_time:
                print(f"Key has expired.")
                time.sleep(1.5)
                update_key("")  
                return

            expiration_time = set_expiration_time(cursor, key_type)
            cnx.commit()

            update_config(key)  
            send_discord_webhook(
                key, get_hwid(), get_ip(), expiration_time
            )

        else:
            print(f"Invalid key.")
            time.sleep(1.5)
            update_key("") 

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        print("Error:", err)

def get_current_time():
    return datetime.now()

def get_ip():
    response = requests.get('https://api.ipify.org?format=json')
    data = response.json()
    return data['ip']

def send_discord_webhook(key, hwid, ip, expires):
    webhook_url = 'WebHook URL' # Your Webhook URL

    embed = {
        'title': 'Login Information',
        'color': 0x00ff00,
        'fields': [
            {'name': 'Key', 'value': f'```{key}```'},
            {'name': 'HWID', 'value': f'```{hwid}```'},
            {'name': 'IP', 'value': f'```{ip}```'},
            {'name': 'Expires', 'value': f'```{expires}```'}
        ]
    }

    data = {
        'username': 'logs',
        'embeds': [embed]
    }

    response = requests.post(webhook_url, json=data)
    if response.status_code != 204:
        print('Failed to send Discord webhook')

def update_config(key):
    config = read_config()
    config['key'] = key
    write_config(config)

def update_key(key):
    config = read_config()
    config['key'] = key
    write_config(config)

def read_config():
    try:
        with open("config.json", "r") as config_file:
            return json.load(config_file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def write_config(config):
    with open("config.json", "w") as config_file:
        json.dump(config, config_file, indent=4)

def main_menu():
    os.system("cls")
    cmd = 'mode 120,30'
    os.system(cmd)
    os.system('cls' if os.name == 'nt' else 'clear')

    config = read_config()
    if 'key' not in config or not config['key']:
        print("1 - Login\n2 - Exit")
        option = input("Enter option: ")
        if option == "1":
            os.system("cls")
            cmd = 'mode 62,3'
            os.system(cmd)
            key = input("Enter your license: ")
            check_key(key)
        elif option == "2":
            sys.exit()
        else:
            main_menu()
    else:
        key = config['key']
        check_key(key)

if __name__ == "__main__":
    main_menu()
    os.system("cls")
    cmd = 'mode 120,30'
    os.system(cmd)
