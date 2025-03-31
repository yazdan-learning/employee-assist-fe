import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { deleteCustomerById } from "../../../slices/customers/thunk";
import { Customer } from "./types";
import { toast } from "react-toastify";

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onDeleteCustomer: (id: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onDeleteCustomer,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this customer?"))) {
      try {
        await dispatch(deleteCustomerById(id));
        toast.success(t("Customer deleted successfully"));
      } catch (error) {
        toast.error(t("Error deleting customer"));
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
            <th>{t("Type")}</th>
            <th>{t("National Code")}</th>
            <th>{t("Tax ID")}</th>
            <th style={{ width: "120px" }}>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <Link
                  to={`/accountant/customers/${customer.id}`}
                  className="text-body fw-bold"
                >
                  {customer.basicInfo.isFirm
                    ? customer.basicInfo.companyName
                    : `${customer.basicInfo.firstName} ${customer.basicInfo.lastName}`}
                </Link>
              </td>
              <td>
                <span
                  className={`badge badge-soft-${
                    customer.basicInfo.isFirm ? "primary" : "success"
                  } font-size-11`}
                >
                  {customer.basicInfo.isFirm ? t("Firm") : t("Individual")}
                </span>
              </td>
              <td>{customer.basicInfo.nationalCode}</td>
              <td>{customer.basicInfo.taxId}</td>
              <td>
                <div className="d-flex gap-3">
                  <Link
                    to={`/accountant/customers/edit/${customer.id}`}
                    className="text-success"
                  >
                    <i className="mdi mdi-pencil font-size-18"></i>
                  </Link>
                  <a
                    href="#"
                    className="text-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCustomer(customer.id);
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

export default CustomerTable;
