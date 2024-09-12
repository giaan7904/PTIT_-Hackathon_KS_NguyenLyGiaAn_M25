'use client';
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
  category_id: number;
}

interface Category {
  id: number;
  title: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("/category.json"); // Lấy dữ liệu từ public/category.json
  return await response.json();
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/product.json"); // Lấy dữ liệu từ public/product.json
  return await response.json();
};

const AdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number>(1);

  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      const categoriesData = await fetchCategories();
      const productsData = await fetchProducts();
      setCategories(categoriesData);
      setProducts(productsData);
    };
    
    loadCategoriesAndProducts();
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: products.length + 1,
      name,
      image,
      price,
      quantity,
      category_id: categoryId
    };
    
    setProducts([...products, newProduct]);
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setImage("");
    setPrice("");
    setQuantity(1);
    setCategoryId(1);
  };

  const handleDeleteProduct = (id: number) => {
    const filteredProducts = products.filter((product) => product.id !== id);
    setProducts(filteredProducts);
  };

  return (
    <div className="admin-page">
      <div className="product-table">
        <h2>Danh sách sản phẩm</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const category = categories.find(cat => cat.id === product.category_id);
              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td><img src={product.image} alt={product.name} width="50" /></td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{category ? category.title : "N/A"}</td>
                  <td>
                    <button onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="add-product-form">
        <h2>Thêm mới sản phẩm</h2>
        <form onSubmit={handleAddProduct}>
          <input 
            type="text" 
            placeholder="Tên sản phẩm" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Hình ảnh" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Giá" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Số lượng" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
          />
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          <button type="submit">Thêm</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
