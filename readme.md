
# Nxyy Auth V1
Nxyy Auth is a auth that doesn't really work well tbh, keyauth is better



## Features

- HWID Lock
- Logging 
- Force Log Out Sessions (Soon)

## Commands

nxyy auth provides the following commands:

- `/create <type> (key)`
  - creates a key <type> Week, Month, Lifetime | <key> optional custom key

- `/reset <key>`
  - resets the hwid for a key 

- `/check <key>`
  - checks key

- `/claim <key>`
  - claims role by key
  
## To-Do List

### Main Script
- HWID Lock ✅
- Discord Webhook Logging ✅
- Expiration date On First Login ✅
- Auto Login ✅
- MYSQL ✅
- Gui ❌
- API ❌

### Bot:
- Create ✅
- Check ✅
- Claim ✅
- Reset HWID ✅
- Key List (DB) (admin) (being made) ❌
- Setup Tutorial ❌ (Soon) 


## Setting Up MySQL Table Using phpMyAdmin

To set up the required MySQL table for Koopa Auth V2 using phpMyAdmin, follow these steps:

1. **Download XAMPP**
   download xampp to get mysql on ur pc, or get a actual db if u want

2. **Access phpMyAdmin:**
   Open your web browser and navigate to the phpMyAdmin interface. You can usually access it by going to `http://localhost/phpmyadmin` or the URL provided by your server administrator.

3. **Create Database:**
   On the left side of the phpMyAdmin interface, Create the database for mysql you can name it whatever u like but i suggest using "auth"

4. **Choose Database**
    On the left side of the phpMyAdmin interface, Choose the database you want to make the auth table for Nxyy Auth V1

5. **Navigate to SQL Tab:**
   Click on the "SQL" tab in the top navigation menu. This is where you can execute SQL queries.

6. **Run SQL Query:**
   In the SQL tab, you'll find a text area. Copy and paste the following SQL query into the text area:
   
```
   CREATE TABLE auth (
     id INT AUTO_INCREMENT PRIMARY KEY,
     auth_key VARCHAR(100) NOT NULL,
     auth_type ENUM('1', '2', '3') NOT NULL,
     hwid VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
```

Note: ✅ indicates completed tasks, and ❌ indicates pending tasks.
