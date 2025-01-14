import { type VariantProps, cva } from 'class-variance-authority';
import { Text, TouchableOpacity } from 'react-native';

import { cn } from '../lib/utils';
import { DotIndicator } from "react-native-indicators";

const DotIndicatorComponent = DotIndicator as React.ComponentType<any>;

const buttonVariants = cva(
  'flex flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        ghost: 'bg-slate-700',
        link: 'text-primary underline-offset-4',
      },
      size: {
        default: 'px-4 py-3.5 px-6',
        sm: 'h-8 px-2',
        lg: 'h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      default: 'text-white',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      ghost: 'text-primary-foreground',
      link: 'text-primary-foreground underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label: string;
  labelClasses?: string;
  isLoading?: boolean;

}


// ... previous code remains the same
function Button({
  label,
  labelClasses,
  className,
  variant,
  size,
  isLoading,

  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
  
      {...props}
    >
      {isLoading ? (
        <DotIndicatorComponent color="white" size={8} count={3} />
      ) : (
        <Text
          className={cn(
            buttonTextVariants({ variant, size, className: labelClasses })
          )}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ... the rest of the component

export { Button, buttonVariants, buttonTextVariants };
