import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { InvoiceType } from "../types";
import { useGenerateInvoiceNumber } from "../../../../hooks/useInvoices";
import { useCustomerList } from "../../../../hooks/useCustomers";

interface InvoiceHeaderProps {
  type: InvoiceType;
  onHeaderChange: (values: any) => void;
  initialValues?: any;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  type,
  onHeaderChange,
  initialValues,
}) => {
  const { t } = useTranslation();
  const { data: customerList } = useCustomerList({
    page: 1,
    pageSize: 1000,
  });
  const customers = customerList?.data?.items || [];
  const { data: generatedNumber } = useGenerateInvoiceNumber(type);

  const validationSchema = Yup.object().shape({
    partnerId: Yup.number().required(t("common.required")),
    number: Yup.string().required(t("common.required")),
    date: Yup.string().required(t("common.required")),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      partnerId: initialValues?.partnerId || "",
      number: initialValues?.number || generatedNumber || "",
      date: initialValues?.date || new Date().toISOString().split("T")[0],
      description: initialValues?.description || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onHeaderChange(values);
    },
  });

  const getCustomerLabel = (customer: typeof customers[0]) => {
    if (customer.isCompany) {
      return customer.companyName || customer.title;
    }
    return `${customer.firstName} ${customer.lastName}`;
  };

  return (
    <div className="invoice-header">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>
              {type === InvoiceType.BUY
                ? t("invoice.form.buyer")
                : t("invoice.form.seller")}
            </Label>
            <RaDropdown
              value={formik.values.partnerId.toString()}
              onChange={(value) => formik.setFieldValue("partnerId", value ? parseInt(value, 10) : "")}
              options={customers.map((c) => ({
                value: c.id.toString(),
                label: getCustomerLabel(c),
              }))}
              placeholder={t("common.select")}
              showClear
            />
            {formik.touched.partnerId && formik.errors.partnerId && (
              <div className="invalid-feedback d-block">
                {String(formik.errors.partnerId)}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.number")}</Label>
            <Input
              type="text"
              name="number"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.number && formik.errors.number)}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.date")}</Label>
            <Input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.date && formik.errors.date)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.description")}</Label>
            <Input
              type="textarea"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceHeader; 