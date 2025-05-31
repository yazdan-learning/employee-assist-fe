import React, { useState } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";

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
  const [currentAccount, setCurrentAccount] = useState<BankAccount>({
    accountNumber: "",
    iban: "",
    cardNumber: "",
    title: "",
    branchName: "",
    branchCode: "",
    bankId: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAccount = () => {
    if (editIndex !== null) {
      // Update existing account
      const newAccounts = [...data.bankAccounts];
      newAccounts[editIndex] = currentAccount;
      onChange({ bankAccounts: newAccounts });
    } else {
      // Add new account
      onChange({
        bankAccounts: [...data.bankAccounts, currentAccount],
      });
    }
    resetForm();
  };

  const handleEditAccount = (index: number) => {
    setCurrentAccount(data.bankAccounts[index]);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDeleteAccount = (index: number) => {
    onChange({
      bankAccounts: data.bankAccounts.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setCurrentAccount({
      accountNumber: "",
      iban: "",
      cardNumber: "",
      title: "",
      branchName: "",
      branchCode: "",
      bankId: 0,
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  return (
    <div>
      <h5>{t("customer.form.bankInfo.title")}</h5>

      {/* Bank Account Form */}
      <Row className="mb-4">
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.accountNumber")}</Label>
            <Input
              type="text"
              name="accountNumber"
              value={currentAccount.accountNumber}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.iban")}</Label>
            <Input
              type="text"
              name="iban"
              value={currentAccount.iban}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.cardNumber")}</Label>
            <Input
              type="text"
              name="cardNumber"
              value={currentAccount.cardNumber}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.title")}</Label>
            <Input
              type="text"
              name="title"
              value={currentAccount.title}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.branchName")}</Label>
            <Input
              type="text"
              name="branchName"
              value={currentAccount.branchName}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.bankInfo.branchCode")}</Label>
            <Input
              type="text"
              name="branchCode"
              value={currentAccount.branchCode}
              onChange={handleAccountChange}
            />
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mb-4">
        <Button color="primary" onClick={handleAddAccount}>
          {isEditing
            ? t("customer.form.buttons.update")
            : t("customer.form.bankInfo.addAccount")}
        </Button>
      </div>

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
