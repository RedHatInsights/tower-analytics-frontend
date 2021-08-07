export type AttributeType = string | string[] | number | number[] | boolean;

export interface SelectOptionProps {
  value: string;
  description: string;
  key: string;
}

export type SetValue = (value: AttributeType | null) => void;
export type SetValues = (type: string, value: AttributeType | null) => void;
