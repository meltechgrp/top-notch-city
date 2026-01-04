import React from "react";
import { TextInput } from "react-native";

export function TextComposer({
  value,
  onChange,
  inputRef,
  placeholder,
  commentId,
}: any) {
  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      multiline
      className="flex-1 text-typography max-h-[100px]"
    />
  );
}
