import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

interface BreadcrumbProps {
  title: string;
  breadcrumbItem: string;
  titleUrl?: string;
}

const Breadcrumb = ({
  title,
  breadcrumbItem,
  titleUrl = "/dashboard",
}: BreadcrumbProps) => {
  return (
    <Row>
      <Col className="col-12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0 font-size-18">{breadcrumbItem}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to={titleUrl}>{title}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{breadcrumbItem}</BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
