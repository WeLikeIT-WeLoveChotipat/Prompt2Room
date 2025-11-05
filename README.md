# Prompt2Room

###  1. สิ่งที่ต้องมีในเครื่อง
- Node.js
- Python
- Git

### 2. การติดตั้ง Frontend
```bash
cd frontend

# ติดตั้งรอบเดียว
# ติดตั้ง package 
npm install

# run หน้า WEB
npm run dev
```

## 3. การติดตั้ง Backend
run terminal อีกตัว
```bash
# ติดตั้งรอบเดียว
python -m venv env

source venv/bin/activate   # สำหรับ macOS/Linux
venv\Scripts\activate      # สำหรับ Windows

pip install -r requirements.txt

#  รันเซิร์ฟเวอร์
uvicorn backend.main:app --reload
```

### RUN WEB
```bash
cd frontend
npm run dev

cd ..
source venv/bin/activate   # สำหรับ macOS/Linux
venv\Scripts\activate      # สำหรับ Windows
uvicorn backend.main:app --reload
```

นายจิรภัทร  วิชัยดิษฐ์     	รหัสนักศึกษา 68070014
นายพงศภัค  บุญสนธิ       รหัสนักศึกษา 68070111
นายยศกร ประหาญภาพ     รหัสนักศึกษา 68070152
นางสาววธูพิตราพร เดชชัง  รหัสนักศึกษา 68070166
