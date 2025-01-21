import { forwardRef, ReactNode } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  prefixClasses?: string;
  suffixClasses?: string;
  suffixIcon?: ReactNode;
  prefixIcon?: ReactNode;
  onPress?: () => void;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      label,
      labelClasses,
      inputClasses,
      suffixIcon,
      prefixIcon,
      onPress,
      prefixClasses,
      suffixClasses,
      ...props
    },
    ref
  ) => {
    return (
      <View className={cn("flex flex-col gap-1.5 ", className)}>
        {label && (
          <Text className={cn("text-base", labelClasses)}>{label}</Text>
        )}
        <TextInput
          className={cn(
            `border border-input py-2.5 px-6 rounded-lg border-[#ccc]`,
            inputClasses,
         
          )}
          {...props}
        />
        {prefixIcon && (
          <View  className={cn("absolute top-3 left-3", prefixClasses)}>
            {prefixIcon}
          </View>
        )}
        {suffixIcon && (
          <TouchableOpacity
            onPress={onPress}
            // style={{ right: 16 }}
            className={cn("absolute top-3 right-4", suffixClasses)}
          >
            {suffixIcon}
          </TouchableOpacity>
        )}
      </View>
    );}
);

export { Input };
