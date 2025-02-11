type fieldsProps = {
  id: string; // Unique identifier for the field
  label: string; // Label displayed for the field
  type: "select"; // Dropdown filter type
  options: { value: string; label: string }[]; // Options for the dropdown
};

export type FilterConfig = {
  title: string; // Title of the filter sheet
  description: string; // Description to guide the user
  fields: fieldsProps[];
};
