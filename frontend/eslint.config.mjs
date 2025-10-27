//dirname ใช้สำหรับดึงชื่อโฟลเดอร์จาก path ของไฟล์ เช่นตัดชื่อไฟล์ออก เหลือแค่ path ของ directory
import { dirname } from "path";
//fileURLToPath ใช้แปลง URL ของไฟล์ (เช่น import.meta.url) ให้เป็น path จริงของไฟล์ในระบบ
import { fileURLToPath } from "url";
//FlatCompat ใช้เพื่อให้สามารถใช้ config แบบเก่า (.eslintrc) กับระบบ config แบบใหม่ของ ESLint (Flat Config)
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
