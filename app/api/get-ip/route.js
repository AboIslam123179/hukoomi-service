// pages/api/get-ip.js
export default function handler(req, res) {
  // الحصول على الـ IP من هيدر الـ x-forwarded-for
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.status(200).json({ ip });
}