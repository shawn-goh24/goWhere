import { useRef, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function SearchBox(props) {
  const { handleInterest } = props;

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    fields: [
      "address_components",
      "geometry",
      "icon",
      "name",
      "formatted_address",
      "place_id",
    ],
    types: ["establishment"],
  };
  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      handleInterest(
        place.name,
        place.formatted_address,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  }, []);

  return (
    <>
      <TextField
        inputRef={inputRef}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
