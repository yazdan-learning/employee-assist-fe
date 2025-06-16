import React from "react";
import { Button, Card, CardBody } from "reactstrap";

interface Column {
  key: string;
  header: string;
  width: number;
  render: (item: any) => React.ReactNode;
  align?: "start" | "center" | "end";
}

interface Action {
  icon: string;
  onClick: (item: any, index: number) => void;
  color?: string;
  disabled?: (item: any) => boolean;
  tooltip?: string;
}

interface CardListContainerProps {
  items: any[];
  columns: Column[];
  actions: Action[];
  keyField?: string;
}

const CardListContainer: React.FC<CardListContainerProps> = ({
  items,
  columns,
  actions,
  keyField = "id",
}) => {
  if (!items.length) return null;

  return (
    <div className="card-list">
      {/* Column Headers */}
      <div className="d-none d-md-flex mb-2 px-3">
        {columns.map((col) => (
          <div
            key={`header-${col.key}`}
            className={`col-${col.width} fw-bold ${
              col.align ? `text-${col.align}` : ""
            }`}
          >
            {col.header}
          </div>
        ))}
        {actions.length > 0 && <div className="col-2 text-end">Actions</div>}
      </div>

      {/* Items */}
      {items.map((item, index) => {
        const itemKey = keyField && item[keyField] ? item[keyField] : `item-${index}`;
        return (
          <Card
            key={itemKey}
            className="mb-2 border shadow-none"
          >
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                {columns.map((col) => (
                  <div
                    key={`${itemKey}-${col.key}`}
                    className={`col-${col.width} ${
                      col.align ? `text-${col.align}` : ""
                    }`}
                  >
                    <div className="d-md-none text-muted small mb-1">
                      {col.header}:
                    </div>
                    {col.render(item)}
                  </div>
                ))}

                {/* Actions */}
                {actions.length > 0 && (
                  <div className="col-2 text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={`${itemKey}-action-${actionIndex}`}
                          color="link"
                          className={`p-0 text-${action.color || "primary"}`}
                          onClick={() => action.onClick(item, index)}
                          disabled={
                            action.disabled ? action.disabled(item) : false
                          }
                          title={action.tooltip}
                        >
                          <i className={`${action.icon} fs-4`}></i>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default CardListContainer;
