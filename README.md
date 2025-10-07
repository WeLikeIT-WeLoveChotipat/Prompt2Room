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
cd backend

# ติดตั้งรอบเดียว
python -m venv venv
pip install -r requirements.txt

source venv/bin/activate   # สำหรับ macOS/Linux
venv\Scripts\activate      # สำหรับ Windows

#  รันเซิร์ฟเวอร์
uvicorn main:app --reload
```

### RUN WEB
```bash
cd frontend
npm run dev

cd backend
source venv/bin/activate   # สำหรับ macOS/Linux
venv\Scripts\activate      # สำหรับ Windows
uvicorn main:app --reload
```

