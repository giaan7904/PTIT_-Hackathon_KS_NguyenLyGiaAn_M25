import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
type Category = {
  id: number;
  title: string;
};
const categoryFilePath = path.join(process.cwd(), 'category.json');
const readCategories = (): Category[] => {
  const data = fs.readFileSync(categoryFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeCategories = (categories: Category[]): void => {
  fs.writeFileSync(categoryFilePath, JSON.stringify(categories, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method === 'GET') {
    const categories = readCategories();
    res.status(200).json(categories);
  } else if (method === 'POST') {
    const { title } = body;
    const categories = readCategories();
    const newCategory: Category = { id: categories.length + 1, title };
    categories.push(newCategory);
    writeCategories(categories);
    res.status(201).json(newCategory);
  } else if (method === 'PUT') {
    const { id, title } = body;
    const categories = readCategories();
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex !== -1) {
      categories[categoryIndex].title = title;
      writeCategories(categories);
      res.status(200).json({ message: 'Category updated successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } else if (method === 'DELETE') {
    const { id } = body;
    let categories = readCategories();
    categories = categories.filter(cat => cat.id !== id);
    writeCategories(categories);
    res.status(200).json({ message: 'Category deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
