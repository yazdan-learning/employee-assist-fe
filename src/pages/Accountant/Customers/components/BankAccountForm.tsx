import React, { useState } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

interface BankAccount {
  accountNumber: string;
  iban: string;
  cardNumber: string;
  title: string;
  branchName: string;
  branchCode: string;
  bankId: number;
}

interface BankAccountFormData {
  bankAccounts: BankAccount[];
}

interface BankAccountFormProps {
  data: BankAccountFormData;
  onChange: (data: BankAccountFormData) => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  data,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string().required(
      t("customer.form.validation.accountNumberRequired")
    ),
    iban: Yup.string().required(t("customer.form.validation.ibanRequired")),
    cardNumber: Yup.string(),
    title: Yup.string().required(
      t("customer.form.validation.accountTitleRequired")
    ),
    branchName: Yup.string().required(
      t("customer.form.validation.branchNameRequired")
    ),
    branchCode: Yup.string().required(
      t("customer.form.validation.branchCodeRequired")
    ),
    bankId: Yup.number().required(t("customer.form.validation.bankRequired")),
  });

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      iban: "",
      cardNumber: "",
      title: "",
      branchName: "",
      branchCode: "",
      bankId: 0,
    },
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values) => {
      if (editIndex !== null) {
        // Update existing account
        const newAccounts = [...data.bankAccounts];
        newAccounts[editIndex] = values;
        onChange({ bankAccounts: newAccounts });
      } else {
        // Add new account
        onChange({
          bankAccounts: [...(data.bankAccounts ?? []), values],
        });
      }
      resetForm();
    },
  });

  const handleEditAccount = (index: number) => {
    const account = data.bankAccounts[index];
    formik.setValues({
      accountNumber: account.accountNumber ?? "",
      iban: account.iban ?? "",
      cardNumber: account.cardNumber ?? "",
      title: account.title ?? "",
      branchName: account.branchName ?? "",
      branchCode: account.branchCode ?? "",
      bankId: account.bankId ?? 0,
    });
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDeleteAccount = (index: number) => {
    onChange({
      bankAccounts: data.bankAccounts.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    formik.resetForm();
    setIsEditing(false);
    setEditIndex(null);
  };

  return (
    <div>
      <h5>{t("customer.form.bankInfo.title")}</h5>

      {/* Bank Account Form */}
      <form onSubmit={formik.handleSubmit}>
        <Row className="mb-4">
          <Col md={6}>
            <FormGroup>
              <Label>{t("customer.form.bankInfo.accountNumber")}</Label>
              <Input
                type="text"
                id="accountNumber"
                {...formik.getFieldProps("accountNumber")}
                invalid={
                  formik.touched.accountNumber &&
                  Boolean(formik.errors.accountNumber)
                }
              />
              {formik.touched.accountNumber && formik.errors.accountNumber && (
                <div className="invalid-feedback d-block">
                  {formik.errors.accountNumber}
                </div>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t("customer.form.bankInfo.iban")}</Label>
              <Input
                type="text"
                id="iban"
                {...formik.getFieldProps("iban")}
                invalid={formik.touched.iban && Boolean(formik.errors.iban)}
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
                id="cardNumber"
                {...formik.getFieldProps("cardNumber")}
                invalid={
                  formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
                }
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div className="invalid-feedback d-block">
                  {formik.errors.cardNumber}
                </div>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t("customer.form.bankInfo.title")}</Label>
              <Input
                type="text"
                id="title"
                {...formik.getFieldProps("title")}
                invalid={formik.touched.title && Boolean(formik.errors.title)}
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
              <Label>{t("customer.form.bankInfo.branchName")}</Label>
              <Input
                type="text"
                id="branchName"
                {...formik.getFieldProps("branchName")}
                invalid={
                  formik.touched.branchName && Boolean(formik.errors.branchName)
                }
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
                id="branchCode"
                {...formik.getFieldProps("branchCode")}
                invalid={
                  formik.touched.branchCode && Boolean(formik.errors.branchCode)
                }
              />
              {formik.touched.branchCode && formik.errors.branchCode && (
                <div className="invalid-feedback d-block">
                  {formik.errors.branchCode}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mb-4">
          <Button type="submit" color="primary">
            {isEditing
              ? t("customer.form.buttons.update")
              : t("customer.form.bankInfo.addAccount")}
          </Button>
        </div>
      </form>

      {/* Bank Accounts List */}
      <div className="table-responsive">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>{t("customer.form.bankInfo.title")}</th>
              <th>{t("customer.form.bankInfo.accountNumber")}</th>
              <th>{t("customer.form.bankInfo.iban")}</th>
              <th>{t("customer.form.bankInfo.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {data.bankAccounts.map((account, index) => (
              <tr key={index}>
                <td>{account.title}</td>
                <td>{account.accountNumber}</td>
                <td>{account.iban}</td>
                <td>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditAccount(index)}
                  >
                    <i className="bx bx-edit"></i>
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteAccount(index)}
                  >
                    <i className="bx bx-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankAccountForm;
