export type AttributeType = string | string[];

export interface SelectOptionProps {
  value: string;
  description: string;
  key: string;
}

export type SetValue = (value: AttributeType | null) => void;
