import * as React from "react";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../context/auth.context";

export default function SelectLabel({ update }) {
  const [selected, setSelected] = React.useState("");
  const { companies, companiesLoading, companiesError } = useAuth();

  const handleChange = (event) => {
    setSelected(event.target.value);
    update(event.target.value);
  };

  if (companiesError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        {companiesError}
      </Alert>
    );
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 400 }}>
      <InputLabel id="company-select-label">Compañia</InputLabel>
      {companiesLoading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, ml: 1 }}>
          <CircularProgress size={20} />
          <span>Cargando compañías...</span>
        </Box>
      ) : (
        <Select
          margin="normal"
          required
          fullWidth
          labelId="company-select-label"
          id="company-select"
          value={selected}
          label="Compañia"
          onChange={handleChange}
          disabled={companiesLoading || companies.length === 0}
        >
          <MenuItem value="">
            <em>Seleccione una compañia</em>
          </MenuItem>
          {companies.map((company) => (
            <MenuItem key={company.codedb} value={company.codedb}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      )}
      <FormHelperText>
        {companies.length === 0 && !companiesLoading
          ? "No hay compañías disponibles"
          : "Seleccione la compañia"}
      </FormHelperText>
    </FormControl>
  );
}

SelectLabel.propTypes = {
  update: PropTypes.func.isRequired,
};
