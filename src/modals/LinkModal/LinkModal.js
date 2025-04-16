import React, { useContext } from "react";
import { Modal, Button, Col } from "react-bootstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import DataContext from "store/DataContext";
import { TextField } from "@mui/material";
import isEqual from "lodash/isEqual";

const identifier = {
  formField: "formFieldWindowParameters",
  skewMarkField: "skewMarksWindowParameters",
};

const LinkModal = (props) => {
  const [fieldValues, setFieldValues] = React.useState([]);
  const [fieldName, setFieldName] = React.useState(null);
  const [fields, setFields] = React.useState([]);
  const dataCtx = useContext(DataContext);
  React.useEffect(() => {
    if (props.selectedCoordinates.length !== 0) {
      const fields = props.selectedCoordinates.filter((field) => {
        return field.fieldType === props.fieldType;
      });
      setFields(fields);
    }
  }, [props.selectedCoordinates, props.fieldType]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFieldValues(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  // console.log("fieldValues", fieldValues);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const allFields = fields.map((field, index) => ({
    ...field,
    id: `${field.name}_${index}`,
  }));
  const saveArea = () => {
    const fieldIndexes = [];
    const filteredFields = allFields.filter((field) => {
      return fieldValues.includes(field.id);
    });

    if (!fieldName) {
      alert("Field Name is required");
      return;
    }
    if (filteredFields.length <= 1) {
      alert("Please select the fields");
      return;
    }
    console.log(dataCtx.allTemplates);
    console.log(props.fieldType);
    const keyIdentifier = identifier[props.fieldType];
    console.log(keyIdentifier);
    const template = dataCtx.allTemplates[0][0][keyIdentifier];
    const formatCoordinate = (field) => ({
      "End Col": field.endCol,
      "End Row": field.endRow + 1,
      "Start Col": field.startCol,
      "Start Row": field.startRow + 1,
      fieldType: field.fieldType,
      name: field.name,
    });

    if (Array.isArray(template)) {
      filteredFields.forEach((field) => {
        const formatted = formatCoordinate(field);

        const index = template.findIndex((item) =>
          isEqual(item.Coordinate, formatted)
        );

        if (index !== -1) {
          fieldIndexes.push(index);
        }
      });
    }

    dataCtx.linkField(filteredFields, fieldName, fieldIndexes, keyIdentifier);
    props.onHide();
  };
  // console.log(dataCtx.allTemplates);
  return (
    <Modal
      show={props.show}
      size="md"
      // onHide={() => setModalShow(false)}
    >
      <Modal.Header>
        <Modal.Title
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          SELECT FIELDS THAT ARE TO BE LINKED
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          width: "100%",
          height: "70dvh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          gap: "1.5rem",
          backgroundColor: "#f9f9f9", // optional: light background
          borderRadius: "12px", // optional: soft rounded edges
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          {props.fieldType}
        </div>

        <FormControl sx={{ width: "100%", maxWidth: 420 }}>
          <TextField
            id="field-name"
            label="Name"
            variant="outlined"
            fullWidth
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ width: "100%", maxWidth: 420 }}>
          <InputLabel id="demo-multiple-checkbox-label">FIELDS</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={fieldValues}
            onChange={handleChange}
            input={<OutlinedInput label="FIELDS" />}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const field = fields.find((f) => f.id === id);
                  return field ? field.name : id;
                })
                .join(", ")
            }
            MenuProps={MenuProps}
          >
            {allFields.map((field) => (
              <MenuItem key={field.id} value={field.id}>
                <Checkbox checked={fieldValues.includes(field.id)} />
                <ListItemText primary={field.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          variant="danger"
          onClick={() => props.onHide()}
          className="waves-effect waves-light"
        >
          Close
        </Button>
        <Button
          type="button"
          variant="success"
          // disabled
          onClick={saveArea}
          className="waves-effect waves-light"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LinkModal;
