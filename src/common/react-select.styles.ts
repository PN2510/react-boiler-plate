export const lightModeStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: 'rgb(209 213 219)', // Tailwind gray-300
    color: 'black',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgb(107 114 128)', // Tailwind gray-500
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    color: 'black',
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    color: 'black',
    zIndex: 20,
  }),
  option: (provided, { isFocused }) => ({
    ...provided,
    backgroundColor: isFocused ? 'rgb(243 244 246)' : 'white', // Tailwind gray-100
    color: 'black',
  }),
};

export const darkModeStyles = {
  control: (provided) => ({
    ...provided,
    padding: '0',
    backgroundColor: 'rgb(31 41 55)', // Tailwind gray-800
    borderColor: 'rgb(55 65 81)', // Tailwind gray-700
    color: 'white',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgb(75 85 99)', // Tailwind gray-600
    },
  }),

  valueContainer: (baseStyle) => ({
    ...baseStyle,
    padding: '0 5px',
  }),
  indicatorsContainer: (baseStyle) => ({
    ...baseStyle,
    padding: '0',
  }),
  dropdownIndicator: (baseStyle) => ({
    ...baseStyle,
    padding: '0 5px',
  }),
  singleValue: (baseStyle) => ({
    ...baseStyle,
    color: 'rgb(243 244 246)',
  }),
  input: (baseStyle) => ({
    ...baseStyle,
    color: 'rgb(243 244 246)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(31 41 55)', // Tailwind gray-800
    color: 'white',
    zIndex: 14,
  }),
  option: (provided, { isFocused }) => ({
    ...provided,
    backgroundColor: isFocused ? 'rgb(55 65 81)' : 'rgb(31 41 55)', // Tailwind gray-700
    color: 'white',
  }),
};
