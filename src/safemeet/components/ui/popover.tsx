import { Popover as ChakraPopover, Portal, HTMLChakraProps } from "@chakra-ui/react"
import { CloseButton } from "./close-button"
import * as React from "react"

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;

  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content ref={ref} {...rest} />
      </ChakraPopover.Positioner>
    </Portal>
  )
})

const ChakraPopoverArrow = ChakraPopover.Arrow as React.ForwardRefExoticComponent<HTMLChakraProps<"div"> & React.RefAttributes<HTMLDivElement>>;

export const PopoverArrow = React.forwardRef<
  HTMLDivElement,
  ChakraPopover.ArrowProps
>(function PopoverArrow(props, ref) {
  return (
    <ChakraPopoverArrow {...props} ref={ref}>
      <ChakraPopover.ArrowTip />
    </ChakraPopoverArrow>
  )
})

const ChakraPopoverCloseTrigger = ChakraPopover.CloseTrigger as React.ForwardRefExoticComponent<HTMLChakraProps<"button"> & React.RefAttributes<HTMLButtonElement>>;

export const PopoverCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  return (
    <ChakraPopoverCloseTrigger
      position="absolute"
      top="1"
      insetEnd="1"
      {...props}
      asChild
      ref={ref}
    >
      <CloseButton size="sm" />
    </ChakraPopoverCloseTrigger>
  )
})

export const PopoverTitle = ChakraPopover.Title as React.ForwardRefExoticComponent<HTMLChakraProps<"h2"> & React.RefAttributes<HTMLHeadingElement>>;
export const PopoverDescription = ChakraPopover.Description as React.ForwardRefExoticComponent<HTMLChakraProps<"p"> & React.RefAttributes<HTMLParagraphElement>>;
export const PopoverFooter = ChakraPopover.Footer as React.ForwardRefExoticComponent<HTMLChakraProps<"footer"> & React.RefAttributes<HTMLDivElement>>;
export const PopoverHeader = ChakraPopover.Header as React.ForwardRefExoticComponent<HTMLChakraProps<"header"> & React.RefAttributes<HTMLDivElement>>;
export const PopoverRoot = ChakraPopover.Root as React.ForwardRefExoticComponent<HTMLChakraProps<"div"> & React.RefAttributes<HTMLDivElement>>;
export const PopoverBody = ChakraPopover.Body as React.ForwardRefExoticComponent<HTMLChakraProps<"div"> & React.RefAttributes<HTMLDivElement>>;
export const PopoverTrigger = ChakraPopover.Trigger as React.ForwardRefExoticComponent<HTMLChakraProps<"button"> & React.RefAttributes<HTMLButtonElement>>;
