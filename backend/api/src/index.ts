//1. Importing Dependencies
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

//2. Configuration 
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); //ใช้ middleware เพื่อให้สามารถรับข้อมูล JSON ได้
app.use(express.urlencoded({ extended: true })); //เพื่อให้สามารถรับข้อมูลจาก HTML Form ได้
app.use(cors());// อนุญาตให้ API ถูกเรียกจากโดเมนอื่น



// MySQL Connection
const db = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
 port: Number(process.env.DB_PORT)
});
db.connect();

//3. Defining API Endpoints
//สร้างฟังก์ชัน query เพื่อใช้ในการ query ข้อมูลและลดความซ้ำซ้อนในการเขียน
app.get('/',(req, res) => {
    res.send('hello, world');
});
function query(sql: string, params: any[] = []):
Promise<any> {
 return new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
   if (err) reject(err);
   else resolve(results);
  });
 });
}

app.post('/plus', (req, res) => {
    let [x, y] = req.body;
    x = parseInt(x);
    y = parseInt(y);
    let z = x + y;
    res.send({ status: true, result: z });
});

app.post('/sub', (req, res) => {
    let [x, y] = req.body;
    x = parseInt(x);
    y = parseInt(y);
    let z = x - y;
    res.send({ status: true, result: z });
});

app.post('/circumference', (req, res) => {
    const { radius } = req.body;
    if (typeof radius !== 'number' || radius <= 0) {
        return res.status(400).send({ status: false, message: 'Invalid radius' });
    }
    const circumference = 2 * Math.PI * radius;
    res.send({
        status: true,
        radius: radius,
        circumference: circumference
    });
});

// CREATE - เพิ่มลูกค้าใหม่
app.post('/api/customer', async (req, res) => {
 try {
  const { username, password, firstName, lastName } = req.body;
  const sql = `
   INSERT INTO customer (username, password, firstName, lastName)
   VALUES (?, ?, ?, ?)
  `;
  const result = await query(sql, [username, password, firstName, lastName]);
  res.json({
   status: true,
   message: 'Customer created successfully'
  });
 } catch (err) {
  res.status(500).json({
   status: false,
   message: 'Failed to create customer'
  });
 }
});

// READ - ดึงลูกค้าทั้งหมด
app.get('/api/customer', async (req, res) => {
  try {
    const sql = `SELECT * FROM customer`;
    const customers = await query(sql);
    res.json({
      status: true,
      message: 'Customers fetched successfully',
      data: customers
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch customers'
    });
  }
});

// READ (by ID) - ดึงลูกค้าคนเดียว
app.get('/api/customer/:custID', async (req, res) => {
  try {
    const { custID } = req.params;
    const sql = `SELECT * FROM customer WHERE custID = ?`;
    const results = await query(sql, [custID]);
    if (results.length === 0) {
      res.status(404).json({
        status: false,
        message: 'Customer not found'
      });
    } else {
      res.json({
        status: true,
        message: 'Customer fetched successfully',
        data: results[0]
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch customer'
    });
  }
});

// UPDATE - แก้ไขลูกค้า
app.put('/api/customer/:custID', async (req, res) => {
  try {
    const { custID } = req.params;
    const { username, password, firstName, lastName } = req.body;
    const sql = `
      UPDATE customer
      SET username = ?, password = ?, firstName = ?, lastName = ?
      WHERE custID = ?
    `;
    const result = await query(sql, [username, password, firstName, lastName, custID]);
    if (result.affectedRows === 0) {
      res.status(404).json({
        status: false,
        message: 'Customer not found'
      });
    } else {
      res.json({
        status: true,
        message: 'Customer updated successfully'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to update customer'
    });
  }
});

// DELETE - ลบลูกค้า
app.delete('/api/customer/:custID', async (req, res) => {
  try {
    const { custID } = req.params;
    const sql = `DELETE FROM customer WHERE custID = ?`;
    const result = await query(sql, [custID]);
    if (result.affectedRows === 0) {
      res.status(404).json({
        status: false,
        message: 'Customer not found'
      });
    } else {
      res.json({
        status: true,
        message: 'Customer deleted successfully'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete customer'
    });
  }
});

// Register
app.post('/api/register', [
 body('username').isString().notEmpty().withMessage('Username is required'),
 body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
 body('firstName').isString().notEmpty().withMessage('First name is required'),
 body('lastName').isString().notEmpty().withMessage('Last name is required')
], async (req: Request, res: Response, next: NextFunction) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
  return res.status(400).send({ message: 'Validation errors', errors: errors.array(), status: false });
 }

 const { username, password, firstName, lastName } = req.body;
 try {
  const existingUser = await query("SELECT * FROM customer WHERE username=?", [username]);
  if (existingUser.length > 0) {
   return res.status(409).send({ message: 'Username already exists', status: false });
  }
  
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  await query('INSERT INTO customer (username, password, firstName, lastName) VALUES (?, ?, ?, ?)',
   [username, password_hash, firstName, lastName]);
  res.send({ message: 'Registration successful', status: true });
 } catch (err) {
  next(err);
 }
});

//4. starting web browser
app.listen(PORT, () => {
    console.log (`Server is running at http://localhost:${PORT}`);
})