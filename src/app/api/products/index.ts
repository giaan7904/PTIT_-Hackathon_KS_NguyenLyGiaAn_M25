
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
  const categories = readCategories();

  // Map products to include category name instead of category_id
  const productsWithCategoryNames = products.map(product => {
    const category = categories.find(cat => cat.id === product.category_id);
    return {
      ...product,
      category_name: category ? category.title : 'Unknown'
    };
  });

  res.status(200).json(productsWithCategoryNames);
}
