import React from "react";
import { Modal, Button, Col } from "react-bootstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
const LinkModal = (props) => {
  const [personName, setPersonName] = React.useState([]);
  const [fields, setFields] = React.useState([]);

  React.useEffect(() => {
    if (props.selectedCoordinates.length !== 0) {
      const fields = props.selectedCoordinates.filter((field) => {
        return field.fieldType === props.fieldType;
      });
      setFields(fields);
    }
  }, [props.selectedCoordinates]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
// console.log("personName", personName);
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
   
    const filteredFields = allFields.filter((field) =>{
        return personName.includes(field.id)
    })
    console.log(filteredFields)

//    const person =  personName.includes(field.id)
//     console.log(person);
  }
//   console.log("allFields", allFields);
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
      <Modal.Body style={{ width: "100%", height: "70dvh", overflow: "auto" }}>
        <FormControl sx={{ m: 1, width: 420 }}>
          <InputLabel id="demo-multiple-checkbox-label">FIELDS</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
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
                <Checkbox checked={personName.includes(field.id)} />
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
