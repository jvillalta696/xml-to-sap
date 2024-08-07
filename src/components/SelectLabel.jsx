import * as React from "react";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectLabel({ update }) {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
    update(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 400 }}>
      <InputLabel id="demo-simple-select-helper-label">Compañia</InputLabel>
      <Select
        margin="normal"
        required
        fullWidth
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Seleccione una compañia</em>
        </MenuItem>
        <MenuItem value={"01"}>CORIMOTORS</MenuItem>
        <MenuItem value={"02"}>SMARTCARS</MenuItem>
      </Select>
      <FormHelperText>Seleccione la compañia</FormHelperText>
    </FormControl>
  );
}

SelectLabel.propTypes = {
  update: PropTypes.func.isRequired,
};
