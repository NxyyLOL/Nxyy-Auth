
# Koopa Auth V2

Koopa Auth is a discord / python / mysql based auth for tools bots and more 



## Features

- HWID Lock
- Logging 
- Force Log Out Sessions ( Soon )

## Commands

Backup Cord provides the following commands:

- `/create <type> (key)`
  - creates a key <type> Week,Month,LifeTime | <key> optional custom key

- `/reset <key>`
  - hwid reset 

- `/check <key>`
  - check key
  
## To-Do List

### Main Script
- HWID Lock ✅
- Discord Webhook Logging ✅
- Expiration Fate On First Login ✅
- Auto Login ✅
- MYSQL ✅
- Gui ❌
- API ❌

### Bot:
- Create ✅
- Check ✅
- Reset HWID ✅
- Setup Tutorial ❌

### Dashboard:
- Public? ❌
- User Panel 
    - Change Logs ✅
    - Trial System ✅
    - Reset Key ✅
    - Tool Downloader ❌
    - Automatic Tool Updates ❌ (api)
    - Reset Key ❌
- Admin Panel ✅
    - Reset Key ✅
    - Reset HWID ✅
    - Key Creation ✅
- Owner Panel ❌
    - Manage Admins ❌ ( Bot and Dashboard ) 
    - Master Keys ❌

## Setting Up MySQL Table Using phpMyAdmin

To set up the required MySQL table for Koopa Auth V2 using phpMyAdmin, follow these steps:

1. **Access phpMyAdmin:**
   Open your web browser and navigate to the phpMyAdmin interface. You can usually access it by going to `http://localhost/phpmyadmin` or the URL provided by your server administrator.

2. **Select Database:**
   On the left side of the phpMyAdmin interface, choose the database where you want to create the table for Koopa Auth V2.

3. **Navigate to SQL Tab:**
   Click on the "SQL" tab in the top navigation menu. This is where you can execute SQL queries.

4. **Run SQL Query:**
   In the SQL tab, you'll find a text area. Copy and paste the following SQL query into the text area:

   ```sql
   CREATE TABLE auth (
     id INT AUTO_INCREMENT PRIMARY KEY,
     auth_key VARCHAR(100) NOT NULL,
     auth_type ENUM('1', '2', '3') NOT NULL,
     hardware_id VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );


Note: ✅ indicates completed tasks, and ❌ indicates pending tasks.
