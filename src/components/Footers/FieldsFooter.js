import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./FieldsFooter.css"; // custom styles

const FieldsFooter = (props) => {
  const [fields, setFields] = useState([]);
  //    const dataCtx = useContext(DataContext);
  useEffect(() => {
    if (Array.isArray(props.selected)) {
      setFields(props.selected);
    }
  }, [props.selected]);
  const allFields = fields.map((item, index) => {
    return (
      <div key={index} className="footer-box text-center mx-2 my-2">
        {item.name}
      </div>
    );
  });
  return (
    <footer className="footer mt-auto py-3 bg-light overflow-auto">
      <div className="d-flex  justify-content-start flex-nowrap px-3">
        {allFields}
      </div>
    </footer>
  );
};

export default FieldsFooter;
