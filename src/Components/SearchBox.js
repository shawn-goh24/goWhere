import React, { useState } from "react";
import { TextField } from "@mui/material";

export default function SearchBox(props) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <TextField
        value={inputValue}
        onChange={(e) => handleChange(e)}
        id={props.id}
      />
    </>
  );
}
