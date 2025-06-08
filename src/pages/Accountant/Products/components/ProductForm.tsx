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
import UnitList from "./UnitList";

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
          units: [],
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
    units: Yup.array()
      .of(
        Yup.object().shape({
          unitId: Yup.number().required(),
          isPrimary: Yup.boolean(),
          conversionRate: Yup.number().required().min(0.0001),
          weightPerUnit: Yup.number().required().min(0),
        })
      )
      .min(1, t("product.form.units.validation.minOneUnit")),
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

                  <Row className="mt-3">
                    <Col md={12}>
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

                  <Row className="mt-4">
                    <Col md={12}>
                      <UnitList
                        units={formik.values.units}
                        onChange={(units) =>
                          formik.setFieldValue("units", units)
                        }
                      />
                      {formik.touched.units && formik.errors.units && (
                        <div className="text-danger mt-2">
                          {typeof formik.errors.units === "string"
                            ? formik.errors.units
                            : t("product.form.units.validation.error")}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col md={12}>
                      <AttributeList
                        attributes={formik.values.attributes}
                        onChange={(attributes) =>
                          formik.setFieldValue("attributes", attributes)
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col md={12}>
                      <div className="d-flex flex-wrap gap-4">
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="isService"
                            {...formik.getFieldProps("isService")}
                            checked={formik.values.isService}
                          />
                          <Label className="form-check-label" for="isService">
                            {t("product.form.isService")}
                          </Label>
                        </FormGroup>

                        <FormGroup check>
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="hasSerial"
                            {...formik.getFieldProps("hasSerial")}
                            checked={formik.values.hasSerial}
                          />
                          <Label className="form-check-label" for="hasSerial">
                            {t("product.form.hasSerial")}
                          </Label>
                        </FormGroup>

                        <FormGroup check>
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="allowNegativeStock"
                            {...formik.getFieldProps("allowNegativeStock")}
                            checked={formik.values.allowNegativeStock}
                          />
                          <Label
                            className="form-check-label"
                            for="allowNegativeStock"
                          >
                            {t("product.form.allowNegativeStock")}
                          </Label>
                        </FormGroup>
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button
                      color="light"
                      type="button"
                      onClick={() => navigate("/accountant/products")}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button color="success" type="submit">
                      {t("common.save")}
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
