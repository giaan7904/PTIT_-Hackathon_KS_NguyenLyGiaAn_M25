
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Path to the category.json file
const categoryFilePath = path.join(process.cwd(), 'category.json');

// Read categories
const readCategories = () => {
  const data = fs.readFileSync(categoryFilePath, 'utf-8');
  return JSON.parse(data);
};

// Mock data of products including category_id
let products = [
  { id: 1, productName: 'Cam', price: 10000, image: '/cam.jpg', quantity: 10, category_id: 1 },
  { id: 2, productName: 'Táo', price: 15000, image: '/tao.jpg', quantity: 5, category_id: 2 },
  { id: 3, productName: 'Ổi', price: 20000, image: '/ổi.jpg', quantity: 20, category_id: 1 },
  { id: 4, productName: 'Xoài', price: 25000, image: '/xoài.jpg', quantity: 5, category_id: 3 },
  { id: 5, productName: 'Chuối', price: 30000, image: '/chuối.jpg', quantity: 20, category_id: 2 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;
  const productId = parseInt(id as string);
  
  const categories = readCategories();

  if (method === 'GET') {
    // Return product details
    const product = products.find(p => p.id === productId);
    if (product) {
      const category = categories.find(cat => cat.id === product.category_id);
      res.status(200).json({
        ...product,
        category_name: category ? category.title : 'Unknown'
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (method === 'PUT') {
    // Update product
    const { productName, price, quantity, image, category_id } = req.body;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex] = { id: productId, productName, price, quantity, image, category_id };
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (method === 'DELETE') {
    // Delete product
    products = products.filter(p => p.id !== productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
