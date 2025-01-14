import { Text } from "react-native";
import { ReactNode } from "react";

type Typography = {
  className?: string;
  children?: ReactNode
}

export const Typography = (props: Typography) => {
  return (
  
      <Text className={`${props.className ?? ""}`}>
        {props?.children}
      </Text>
 
  )
}