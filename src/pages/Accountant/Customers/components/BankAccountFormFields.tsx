import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BankAccount } from "../types";

interface BankAccountFormFieldsProps {
  bankAccount?: BankAccount;
  onSave: (bankAccount: BankAccount) => void;
  onCancel: () => void;
}

const BankAccountFormFields: React.FC<BankAccountFormFieldsProps> = ({
  bankAccount,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string().required(t("validation.required")),
    iban: Yup.string().required(t("validation.required")),
    cardNumber: Yup.string().required(t("validation.required")),
    title: Yup.string().required(t("validation.required")),
    branchName: Yup.string().required(t("validation.required")),
    branchCode: Yup.string().required(t("validation.required")),
    bankId: Yup.number().required(t("validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      accountNumber: bankAccount?.accountNumber || "",
      iban: bankAccount?.iban || "",
      cardNumber: bankAccount?.cardNumber || "",
      title: bankAccount?.title || "",
      branchName: bankAccount?.branchName || "",
      branchCode: bankAccount?.branchCode || "",
      bankId: bankAccount?.bankId || 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to show validation errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Validate all fields
    const errors = await formik.validateForm();

    // If no errors, proceed with save
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    }
  };

  return (
    <form>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.accountTitle")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("title")}
              invalid={formik.touched.title && Boolean(formik.errors.title)}
              placeholder={t(
                "customer.form.bankInfo.placeholders.accountTitle"
              )}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="invalid-feedback d-block">
                {formik.errors.title}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.accountNumber")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("accountNumber")}
              invalid={
                formik.touched.accountNumber &&
                Boolean(formik.errors.accountNumber)
              }
              placeholder={t(
                "customer.form.bankInfo.placeholders.accountNumber"
              )}
            />
            {formik.touched.accountNumber && formik.errors.accountNumber && (
              <div className="invalid-feedback d-block">
                {formik.errors.accountNumber}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.iban")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("iban")}
              invalid={formik.touched.iban && Boolean(formik.errors.iban)}
              placeholder={t("customer.form.bankInfo.placeholders.iban")}
            />
            {formik.touched.iban && formik.errors.iban && (
              <div className="invalid-feedback d-block">
                {formik.errors.iban}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.cardNumber")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("cardNumber")}
              invalid={
                formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
              }
              placeholder={t("customer.form.bankInfo.placeholders.cardNumber")}
            />
            {formik.touched.cardNumber && formik.errors.cardNumber && (
              <div className="invalid-feedback d-block">
                {formik.errors.cardNumber}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.branchName")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("branchName")}
              invalid={
                formik.touched.branchName && Boolean(formik.errors.branchName)
              }
              placeholder={t("customer.form.bankInfo.placeholders.branchName")}
            />
            {formik.touched.branchName && formik.errors.branchName && (
              <div className="invalid-feedback d-block">
                {formik.errors.branchName}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.branchCode")}</Label>
            <Input
              type="text"
              {...formik.getFieldProps("branchCode")}
              invalid={
                formik.touched.branchCode && Boolean(formik.errors.branchCode)
              }
              placeholder={t("customer.form.bankInfo.placeholders.branchCode")}
            />
            {formik.touched.branchCode && formik.errors.branchCode && (
              <div className="invalid-feedback d-block">
                {formik.errors.branchCode}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.bankId")}</Label>
            <Input
              type="number"
              {...formik.getFieldProps("bankId")}
              invalid={formik.touched.bankId && Boolean(formik.errors.bankId)}
              placeholder={t("customer.form.bankInfo.placeholders.bankId")}
            />
            {formik.touched.bankId && formik.errors.bankId && (
              <div className="invalid-feedback d-block">
                {formik.errors.bankId}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" color="secondary" onClick={onCancel}>
          {t("customer.form.buttons.cancel")}
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          {t("customer.form.buttons.save")}
        </Button>
      </div>
    </form>
  );
};

export default BankAccountFormFields;
