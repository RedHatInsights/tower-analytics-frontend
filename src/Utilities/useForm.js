import { useReducer } from 'react';

const useForm = (initial) => {
  const formReducer = (state, { type, value }) => {
    switch (type) {
      /* v1 api reducers */
      case 'SET_FIELD':
        return { ...state, ...value };
      default:
        throw new Error();
    }
  };

  const [formData, dispatch] = useReducer(formReducer, {
    ...initial,
  });

  return {
    formData,
    setField: (field, value) =>
      dispatch({ type: 'SET_FIELD', value: { [field]: value } }),
  };
};

export default useForm;
