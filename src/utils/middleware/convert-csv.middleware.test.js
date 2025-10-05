import express from 'express';
import multer from 'multer';
import request from 'supertest';
import { convertCsv } from './convert-csv.middleware.js';

const app = express();
const upload = multer();

app.post('/convert', upload.single('file'), convertCsv, (req, res) => {
  return res.status(200).json({ zipBase64: req.zipBase64 });
});

describe('convertCsv function', () => {
  test('should return 400 if no file is sent', async () => {
    const response = await request(app).post('/convert').send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'No file sent' });
  });

  test('should successfully convert a CSV file and return base64 string', async () => {
    const csvContent = 'column1,column2\nvalue1,value2';
    const buffer = Buffer.from(csvContent);

    const response = await request(app)
      .post('/convert')
      .attach('file', buffer, { filename: 'test.csv' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('zipBase64');

    // Optionally, you can further decode the base64 and check the contents
    const zipBuffer = Buffer.from(response.body.zipBase64, 'base64');
    expect(zipBuffer).toBeInstanceOf(Buffer);
    // Here you could add more checks for zip contents if necessary
  });

  test('should handle errors appropriately', async () => {
    // Mocking an error scenario by sending an invalid file buffer
    const invalidBuffer = null; // This will simulate an error in the middleware

    const response = await request(app)
      .post('/convert')
      .attach('file', invalidBuffer, { filename: 'test.csv' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBeDefined();
  });
});
