import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { deleteProductById } from "../../../slices/products/thunk";
import { Product } from "./types";
import { toast } from "react-toastify";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, loading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      try {
        await dispatch(deleteProductById(id));
        toast.success(t("Product deleted successfully"));
      } catch (error) {
        toast.error(t("Error deleting product"));
      }
    }
  };

  if (loading) {
    return <div className="text-center">{t("Loading...")}</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-centered table-nowrap mb-0">
        <thead className="table-light">
          <tr>
            <th>{t("Name")}</th>
            <th>{t("SKU")}</th>
            <th>{t("Category")}</th>
            <th>{t("Price")}</th>
            <th>{t("Stock")}</th>
            <th>{t("Status")}</th>
            <th style={{ width: "120px" }}>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link
                  to={`/accountant/products/${product.id}`}
                  className="text-body fw-bold"
                >
                  {product.name}
                </Link>
              </td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={`badge badge-soft-${
                    product.status === "ACTIVE"
                      ? "success"
                      : product.status === "INACTIVE"
                      ? "warning"
                      : "danger"
                  } font-size-11`}
                >
                  {t(product.status)}
                </span>
              </td>
              <td>
                <div className="d-flex gap-3">
                  <Link
                    to={`/accountant/products/edit/${product.id}`}
                    className="text-success"
                  >
                    <i className="mdi mdi-pencil font-size-18"></i>
                  </Link>
                  <Link
                    to={`/accountant/products/${product.id}`}
                    className="text-primary"
                  >
                    <i className="mdi mdi-eye font-size-18"></i>
                  </Link>
                  <a
                    href="#"
                    className="text-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteProduct(product.id);
                    }}
                  >
                    <i className="mdi mdi-delete font-size-18"></i>
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
