import React, { useEffect, useState } from "react";
import {
  postProduct,
  getAllProducts,
  IProduct,
  deleteProduct,
} from "../services/productService";
import { Table, TableColumn, Loading } from "../components";

const productColumns: TableColumn<IProduct>[] = [
  { header: "ID", accessor: "id" as keyof IProduct },
  { header: "Name", accessor: "name" as keyof IProduct },
  {
    header: "Price",
    accessor: "price" as keyof IProduct,
    Cell: (product: IProduct) => `$${product.price.toFixed(2)}`,
  },
];

export const Product: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct: IProduct) => {
    try {
      setLoading(true);
      const addedProduct = await postProduct(newProduct);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: IProduct) => {
    const productId = product.id;
    try {
      setLoading(true);
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        {loading && <Loading />}
        <h1>Product List</h1>
        <Table
          data={products}
          columns={productColumns}
          addItem={handleAddProduct}
          deleteItem={handleDeleteProduct}
        />
      </div>
    </>
  );
};
