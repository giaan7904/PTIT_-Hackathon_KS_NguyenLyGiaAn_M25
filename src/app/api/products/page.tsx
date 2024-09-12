'use client';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; 

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, productName: 'Cam', price: 10000, image: '/cam.jpg', quantity: 10 },
    { id: 2, productName: 'Táo', price: 15000, image: '/tao.jpg', quantity: 5 },
    { id: 3, productName: 'Ổi', price: 20000, image: '/ổi.jpg', quantity: 20 },
    { id: 4, productName: 'Xoài', price: 25000, image: '/xoài.jpg', quantity: 5 },
    { id: 5, productName: 'Chuối', price: 30000, image: '/chuối.jpg', quantity: 20 },
  ]);

  const [newProduct, setNewProduct] = useState<Product>({
    id: products.length + 1,
    productName: '',
    price: 0,
    image: '',
    quantity: 0,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    if (editingProductId === null) {
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(product => product.id === editingProductId ? newProduct : product));
      setEditingProductId(null); 
    }
    setNewProduct({ id: products.length + 1, productName: '', price: 0, image: '', quantity: 0 });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
  };

  const handleSearchProduct = () => {
    axios.get(`/api/products/search?name=${searchQuery}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Không tìm thấy sản phẩm', error);
        setProducts([]); // Nếu không tìm thấy sản phẩm, reset danh sách
      });
  };

  const handleViewDetails = (id: number) => {
    axios.get(`/api/products/${id}`)
      .then(response => {
        setSelectedProduct(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy chi tiết sản phẩm', error);
      });
  };

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>

      <div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchProduct}>Tìm kiếm</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th> 
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>
                  <Image 
                    src={product.image} 
                    alt={product.productName} 
                    width={50} 
                    height={50}  
                  />
                </td>
                <td>{product.price} VND</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Sửa</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                  <button onClick={() => handleViewDetails(product.id)}>Xem chi tiết</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không tìm thấy sản phẩm nào</td> 
            </tr>
          )}
        </tbody>
      </table>

      {selectedProduct && (
        <div>
          <h2>Chi tiết sản phẩm</h2>
          <p>ID: {selectedProduct.id}</p>
          <p>Tên: {selectedProduct.productName}</p>
          <p>Giá: {selectedProduct.price} VND</p>
          <p>Số lượng: {selectedProduct.quantity}</p>
          <Image src={selectedProduct.image} alt={selectedProduct.productName} width={100} height={100} />
        </div>
      )}

      <h2>{editingProductId === null ? 'Thêm mới sản phẩm' : 'Cập nhật sản phẩm'}</h2>
      <div>
        <input
          type="text"
          name="productName"
          placeholder="Tên sản phẩm"
          value={newProduct.productName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Hình ảnh"
          value={newProduct.image}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={newProduct.quantity}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>
          {editingProductId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}
