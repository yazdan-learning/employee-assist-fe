import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Input, Modal, ModalHeader, Row, ModalBody, CardTitle, InputGroup, Nav, NavItem, NavLink } from 'reactstrap';
import Activity from './Activity';
import MonthlyEarning from './MonthlyEarning';
import SocialSource from './SocialSource';
import TopCities from './TopCities';
import WelComeback from './WelComeback';
import classNames from "classnames";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';

import { getChartData as onGetChartData } from '../../slices/dashboards/thunk';

import Breadcrumb from '../../Components/Common/Breadcrumb';
import { DashboardEmailItem, Report } from './type';

interface selectState {
  dashboard: {
    dashboardChartData: DashboardEmailItem[];
    loading: boolean;
  };
}

const Dashboard = () => {

  document.title = "Dashboards | Skote - React Admin & Dashboard Template";

  const [subScribeModal, setSubScribeModal] = useState<boolean>(false);

  const reports: Report[] = [
    { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
    { title: "Revenue", iconClass: "bx-archive-in", description: "$35, 723" },
    { title: "Average Price", iconClass: "bx-purchase-tag-alt", description: "$16.2" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setSubScribeModal(true);
    }, 2000);
  }, []);

  const [periodData, setPeriodData] = useState<any>([]);
  const [periodType, setPeriodType] = useState<string>("Year");

  const selectProperties = createSelector(
    (state: selectState) => state.dashboard,
    (dashboard) => ({
      chartsData: dashboard?.dashboardChartData
    })
  );

  const { chartsData } = useSelector(selectProperties);

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  const onChangeChartPeriod = (pType: any) => {
    setPeriodType(pType);
    dispatch(onGetChartData(pType));
  };

  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(onGetChartData("Year"));
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboards" breadcrumbItem="Dashboard" />
          <Row>
            <Col xl={4}>
              <WelComeback />
              <MonthlyEarning />
            </Col>
            <Col xl={8}>
              <Row>
                {(reports || []).map((report: Report, key: number) => (
                  <Col md={4} key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium"> {report.title} </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx " + report.iconClass + " font-size-24"} ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card>
                <CardBody>
                  <div className="d-sm-flex flex-wrap">
                    <CardTitle tag="h4" className="mb-4">Email Sent</CardTitle>
                    <div className="ms-auto">
                      <Nav pills>
                        <NavItem>
                          <NavLink href="#" className={classNames({ active: periodType === "Week" }, "nav-link")}
                            onClick={() => {
                              onChangeChartPeriod("Week");
                            }}
                            id="one_month">Week</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href="#" className={classNames({ active: periodType === "Month" }, "nav-link")}
                            onClick={() => {
                              onChangeChartPeriod("Month");
                            }}
                            id="one_month" > Month </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href="#" className={classNames({ active: periodType === "Year" }, "nav-link")}
                            onClick={() => {
                              onChangeChartPeriod("Year");
                            }}
                            id="one_month" > Year  </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <SocialSource />
            </Col>
            <Col xl={4}>
              <Activity />
            </Col>

            <Col xl={4}>
              <TopCities />
            </Col>
          </Row>
        </Container>
      </div >

      {/* subscribe ModalHeader */}
      <Modal isOpen={subScribeModal} autoFocus={true} centered toggle={() => { setSubScribeModal(!subScribeModal) }}>
        <div>
          <ModalHeader className="border-bottom-0" toggle={() => { setSubScribeModal(!subScribeModal) }} />
        </div>
        <ModalBody>
          <div className="text-center mb-4">
            <div className="avatar-md mx-auto mb-4">
              <div className="avatar-title bg-light  rounded-circle text-primary h1">
                <i className="mdi mdi-email-open"></i>
              </div>
            </div>

            <Row className="justify-content-center">
              <Col xl={10}>
                <h4 className="text-primary">Subscribe !</h4>
                <p className="text-muted font-size-14 mb-4">
                  Subscribe our newletter and get notification to stay update.
                </p>

                <InputGroup className="rounded bg-light">
                  <Input type="email" className="bg-transparent border-0" placeholder="Enter Email address" />
                  <Button color="primary" type="button" id="button-addon2"> <i className="bx bxs-paper-plane"></i> </Button>
                </InputGroup>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal >

    </React.Fragment >
  );
}

export default Dashboard;