import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { BankAccount } from "../types";
import BankAccountFormFields from "./BankAccountFormFields";
import CardListContainer from "../../../../Components/Common/CardListContainer";

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

  const columns = [
    {
      key: "title",
      header: t("customer.form.bankInfo.accountTitle"),
      width: 2,
      render: (account: BankAccount) => (
        <span className="fw-medium">{account.title}</span>
      ),
    },
    {
      key: "accountNumber",
      header: t("customer.form.bankInfo.accountNumber"),
      width: 3,
      render: (account: BankAccount) => <span>{account.accountNumber}</span>,
    },
    {
      key: "iban",
      header: t("customer.form.bankInfo.iban"),
      width: 3,
      render: (account: BankAccount) => <span>{account.iban}</span>,
    },
    {
      key: "branchName",
      header: t("customer.form.bankInfo.branchName"),
      width: 2,
      render: (account: BankAccount) => <span>{account.branchName}</span>,
    },
  ];

  const actions = [
    {
      icon: "bx bx-edit-alt",
      color: "primary",
      onClick: (_: any, index: number) => handleEdit(index),
    },
    {
      icon: "bx bx-trash",
      color: "danger",
      onClick: (_: any, index: number) => handleRemove(index),
    },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{t("customer.form.bankInfo.title")}</h5>
        <Button color="primary" size="sm" onClick={handleAdd}>
          <i className="bx bx-plus me-1"></i>
          {t("customer.form.bankInfo.add")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-3">
          <CardBody>
            <h6 className="mb-3">
              {editIndex !== null
                ? t("customer.form.bankInfo.edit")
                : t("customer.form.bankInfo.add")}
            </h6>
            <BankAccountFormFields
              bankAccount={
                editIndex !== null ? bankAccounts[editIndex] : undefined
              }
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </CardBody>
        </Card>
      )}

      {/* Bank Accounts List */}
      <CardListContainer
        items={bankAccounts}
        columns={columns}
        actions={actions}
        keyField="id"
      />
    </div>
  );
};

export default BankAccountForm;
