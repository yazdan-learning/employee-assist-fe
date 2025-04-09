import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ProductFormData, ProductStatus } from "./types";
import {
  createProduct,
  fetchProductById,
  updateProductById,
} from "../../../slices/products/thunk";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RootState {
  product: {
    selectedProduct: any;
    loading: boolean;
    error: string | null;
  };
}

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    sku: "",
    status: ProductStatus.ACTIVE,
  });

  const { selectedProduct, loading } = useSelector((state: RootState) => ({
    selectedProduct: state.product.selectedProduct,
    loading: state.product.loading,
  }));

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        price: selectedProduct.price,
        cost: selectedProduct.cost,
        stock: selectedProduct.stock,
        sku: selectedProduct.sku,
        barcode: selectedProduct.barcode,
        image: selectedProduct.image,
        status: selectedProduct.status,
      });
    }
  }, [id, selectedProduct]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateProductById(id, formData));
        toast.success(t("Product updated successfully"));
      } else {
        await dispatch(createProduct(formData));
        toast.success(t("Product created successfully"));
      }
      navigate("/accountant/products");
    } catch (error) {
      toast.error(t("Error saving product"));
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Products")}
          breadcrumbItem={id ? t("Edit Product") : t("Add Product")}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="name">{t("Name")}</Label>
                        <Input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="sku">{t("SKU")}</Label>
                        <Input
                          type="text"
                          id="sku"
                          value={formData.sku}
                          onChange={(e) =>
                            handleInputChange("sku", e.target.value)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <Label for="description">{t("Description")}</Label>
                    <Input
                      type="textarea"
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                    />
                  </FormGroup>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="category">{t("Category")}</Label>
                        <Input
                          type="text"
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="status">{t("Status")}</Label>
                        <Input
                          type="select"
                          id="status"
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                        >
                          <option value={ProductStatus.ACTIVE}>
                            {t("ACTIVE")}
                          </option>
                          <option value={ProductStatus.INACTIVE}>
                            {t("INACTIVE")}
                          </option>
                          <option value={ProductStatus.OUT_OF_STOCK}>
                            {t("OUT_OF_STOCK")}
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="price">{t("Price")}</Label>
                        <Input
                          type="number"
                          id="price"
                          value={formData.price}
                          onChange={(e) =>
                            handleInputChange(
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          required
                          min="0"
                          step="0.01"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cost">{t("Cost")}</Label>
                        <Input
                          type="number"
                          id="cost"
                          value={formData.cost}
                          onChange={(e) =>
                            handleInputChange(
                              "cost",
                              parseFloat(e.target.value)
                            )
                          }
                          required
                          min="0"
                          step="0.01"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="stock">{t("Stock")}</Label>
                        <Input
                          type="number"
                          id="stock"
                          value={formData.stock}
                          onChange={(e) =>
                            handleInputChange("stock", parseInt(e.target.value))
                          }
                          required
                          min="0"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      color="secondary"
                      onClick={() => navigate("/accountant/products")}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button color="primary" type="submit">
                      {id ? t("Update") : t("Create")}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ToastContainer />
      </Container>
    </div>
  );
};

export default ProductForm;
