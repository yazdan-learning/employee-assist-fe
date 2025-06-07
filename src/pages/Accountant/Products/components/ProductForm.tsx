import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { Product, Category, Unit, Location } from "../types";
import {
  useCreateProduct,
  useUpdateProduct,
  useProductById,
} from "../../../../hooks/useProducts";
import { productService } from "../../../../services/ProductService";
import AttributeList from "./AttributeList";

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useProductById(id ? parseInt(id, 10) : 0);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // Load dropdown data
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);

  React.useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const cats = await productService.getCategories();
        const uns = await productService.getUnits();
        const locs = await productService.getLocations();

        setCategories(cats as Category[]);
        setUnits(uns as Unit[]);
        setLocations(locs as Location[]);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        toast.error(t("product.form.messages.loadError"));
      }
    };
    loadDropdownData();
  }, [t]);

  const initialValues: Product =
    id && productResponse?.data
      ? productResponse.data
      : {
          name: "",
          barcode: "",
          isService: false,
          hasSerial: false,
          allowNegativeStock: false,
          categoryId: null,
          attributes: [],
          unitId: null,
          locationId: null,
        };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validation.required")),
    barcode: Yup.string(),
    isService: Yup.boolean(),
    hasSerial: Yup.boolean(),
    allowNegativeStock: Yup.boolean(),
    categoryId: Yup.number().nullable(),
    attributes: Yup.array().of(
      Yup.object().shape({
        attributeId: Yup.number().required(),
        valueId: Yup.number().required(),
      })
    ),
    unitId: Yup.number().nullable(),
    locationId: Yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (id) {
          const response = await updateMutation.mutateAsync({
            ...values,
            id: parseInt(id, 10),
          });
          if (response.succeeded) {
            toast.success(t("product.form.messages.updateSuccess"));
            navigate("/accountant/products");
          } else {
            toast.error(t("product.form.messages.updateError"));
          }
        } else {
          const response = await createMutation.mutateAsync(values);
          if (response.succeeded) {
            toast.success(t("product.form.messages.createSuccess"));
            navigate("/accountant/products");
          } else {
            toast.error(t("product.form.messages.createError"));
          }
        }
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(t("product.form.messages.saveError"));
      }
    },
  });

  if (id && isLoading) {
    return <div>Loading...</div>;
  }

  if (id && isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">
                  {id
                    ? t("product.form.title.edit")
                    : t("product.form.title.new")}
                </h4>

                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="name">{t("product.form.name")}</Label>
                        <Input
                          type="text"
                          id="name"
                          {...formik.getFieldProps("name")}
                          invalid={
                            formik.touched.name && Boolean(formik.errors.name)
                          }
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="barcode">{t("product.form.barcode")}</Label>
                        <Input
                          type="text"
                          id="barcode"
                          {...formik.getFieldProps("barcode")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            {...formik.getFieldProps("isService")}
                            checked={formik.values.isService}
                          />{" "}
                          {t("product.form.isService")}
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            {...formik.getFieldProps("hasSerial")}
                            checked={formik.values.hasSerial}
                          />{" "}
                          {t("product.form.hasSerial")}
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            {...formik.getFieldProps("allowNegativeStock")}
                            checked={formik.values.allowNegativeStock}
                          />{" "}
                          {t("product.form.allowNegativeStock")}
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label for="categoryId">
                          {t("product.form.category")}
                        </Label>
                        <RaDropdown
                          options={categories.map((c) => ({
                            value: c.id.toString(),
                            label: c.name,
                          }))}
                          value={formik.values.categoryId?.toString() || ""}
                          onChange={(value) =>
                            formik.setFieldValue(
                              "categoryId",
                              value ? Number(value) : null
                            )
                          }
                          placeholder={t("product.form.placeholders.category")}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="unitId">{t("product.form.unit")}</Label>
                        <RaDropdown
                          options={units.map((u) => ({
                            value: u.id.toString(),
                            label: u.name,
                          }))}
                          value={formik.values.unitId?.toString() || ""}
                          onChange={(value) =>
                            formik.setFieldValue(
                              "unitId",
                              value ? Number(value) : null
                            )
                          }
                          placeholder={t("product.form.placeholders.unit")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <AttributeList
                        attributes={formik.values.attributes}
                        onChange={(attributes) =>
                          formik.setFieldValue("attributes", attributes)
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <FormGroup>
                        <Label for="locationId">
                          {t("product.form.location")}
                        </Label>
                        <RaDropdown
                          options={locations.map((l) => ({
                            value: l.id.toString(),
                            label: l.name,
                          }))}
                          value={formik.values.locationId?.toString() || ""}
                          onChange={(value) =>
                            formik.setFieldValue(
                              "locationId",
                              value ? Number(value) : null
                            )
                          }
                          placeholder={t("product.form.placeholders.location")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-4">
                    <Button color="success" type="submit">
                      {id
                        ? t("product.form.buttons.update")
                        : t("product.form.buttons.save")}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductForm;
