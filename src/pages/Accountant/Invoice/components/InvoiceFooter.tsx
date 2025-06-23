import React from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { InvoiceDetail } from "../types";

interface InvoiceFooterProps {
  details: InvoiceDetail[];
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ details }) => {
  const { t } = useTranslation();

  const totalAmount = details.reduce(
    (sum, detail) => sum + detail.quantity * detail.unitPrice,
    0
  );

  const totalDiscount = details.reduce(
    (sum, detail) =>
      sum + detail.quantity * detail.unitPrice * (detail.discount / 100),
    0
  );

  const totalVat = details.reduce(
    (sum, detail) =>
      sum +
      detail.quantity *
        detail.unitPrice *
        (1 - detail.discount / 100) *
        (detail.vat / 100),
    0
  );

  const finalAmount = details.reduce(
    (sum, detail) => sum + detail.finalPrice,
    0
  );

  return (
    <div className="invoice-footer">
      <Row className="justify-content-end">
        <Col md={6}>
          <div className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between mb-2">
              <span>{t("invoice.form.totalAmount")}</span>
              <span className="fw-bold">
                {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>{t("invoice.form.totalDiscount")}</span>
              <span className="fw-bold text-danger">
                -{totalDiscount.toLocaleString()}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>{t("invoice.form.totalVat")}</span>
              <span className="fw-bold text-success">
                +{totalVat.toLocaleString()}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold">{t("invoice.form.finalAmount")}</span>
              <span className="fw-bold fs-5">
                {finalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceFooter; 