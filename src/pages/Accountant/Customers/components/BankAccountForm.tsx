import React, { useState } from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { BankAccount } from "../types";
import BankAccountFormFields from "./BankAccountFormFields";

interface BankAccountFormProps {
  bankAccounts: BankAccount[];
  onChange: (bankAccounts: BankAccount[]) => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  bankAccounts,
  onChange,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setShowForm(true);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setShowForm(true);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    const newBankAccounts = bankAccounts.filter((_, i) => i !== index);
    onChange(newBankAccounts);
  };

  const handleSave = (bankAccount: BankAccount) => {
    let newBankAccounts: BankAccount[];
    if (editIndex !== null) {
      newBankAccounts = [...bankAccounts];
      newBankAccounts[editIndex] = bankAccount;
    } else {
      newBankAccounts = [...bankAccounts, bankAccount];
    }
    onChange(newBankAccounts);
    setShowForm(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>{t("customer.form.bankInfo.title")}</h6>
        <Button color="primary" size="sm" onClick={handleAdd}>
          {t("customer.form.bankInfo.add")}
        </Button>
      </div>

      {showForm && (
        <div className="mb-3">
          <Card>
            <CardBody>
              <BankAccountFormFields
                bankAccount={
                  editIndex !== null ? bankAccounts[editIndex] : undefined
                }
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {bankAccounts.length > 0 && (
        <Row>
          {bankAccounts.map((account, index) => (
            <Col md={12} key={index} className="mb-3">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0">{account.title}</h6>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <i className="bx bx-edit"></i>
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleRemove(index)}
                      >
                        <i className="bx bx-trash"></i>
                      </Button>
                    </div>
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="bank-account-details">
                        <div className="mb-2">
                          <small className="text-muted">
                            {t("customer.form.bankInfo.accountNumber")}:
                          </small>
                          <div>{account.accountNumber}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">
                            {t("customer.form.bankInfo.iban")}:
                          </small>
                          <div>{account.iban}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">
                            {t("customer.form.bankInfo.cardNumber")}:
                          </small>
                          <div>{account.cardNumber}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="bank-account-details">
                        <div className="mb-2">
                          <small className="text-muted">
                            {t("customer.form.bankInfo.branchName")}:
                          </small>
                          <div>{account.branchName}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">
                            {t("customer.form.bankInfo.branchCode")}:
                          </small>
                          <div>{account.branchCode}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BankAccountForm;
