import { NextApiRequest, NextApiResponse } from 'next';

const products = [
  { id: 1, productName: 'Cam', price: 10000, image: '/cam.jpg', quantity: 10 },
  { id: 2, productName: 'Táo', price: 15000, image: '/tao.jpg', quantity: 5 },
  { id: 3, productName: 'Ổi', price: 20000, image: '/ổi.jpg', quantity: 20 },
  { id: 4, productName: 'Xoài', price: 25000, image: '/xoài.jpg', quantity: 5 },
  { id: 5, productName: 'Chuối', price: 30000, image: '/chuối.jpg', quantity: 20 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Thiếu tên sản phẩm để tìm kiếm' });
  }

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(name.toLowerCase())
  );

  if (filteredProducts.length > 0) {
    res.status(200).json(filteredProducts);
  } else {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm nào' });
  }
}
