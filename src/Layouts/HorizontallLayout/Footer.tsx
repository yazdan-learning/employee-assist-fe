import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container fluid={true}>
        <Row>
          <Col md={6}>{new Date().getFullYear()} © Employee Assist.</Col>
          <Col md={6}>
            <div className="text-sm-end d-none d-sm-block">
              Helping you manage your team efficiently.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
