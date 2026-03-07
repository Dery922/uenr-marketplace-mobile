import API from "./axios";


export const addProduct = (formData) => {
  return API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyProducts = () => API.get("/my-products");

export const updateProduct = (id: string, data: any) =>
  API.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  API.delete(`/products/${id}`);

export const getAllProducts = () => API.get("/all-products");


export const getMyProductCount = () =>
  API.get("/my/count");