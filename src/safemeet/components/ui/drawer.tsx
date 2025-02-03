import { Drawer as ChakraDrawer, Portal, HTMLChakraProps } from "@chakra-ui/react"
import { CloseButton } from "./close-button"
import * as React from "react"

interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: HTMLChakraProps<"div">["p"];
  children: React.ReactNode;
}

const ChakraDrawerPositioner = ChakraDrawer.Positioner as React.FC<HTMLChakraProps<"div">>
const ChakraDrawerContent = ChakraDrawer.Content as React.ForwardRefExoticComponent<HTMLChakraProps<"section"> & React.RefAttributes<HTMLDivElement>>
const ChakraDrawerCloseTrigger = ChakraDrawer.CloseTrigger as React.FC<HTMLChakraProps<"button">>

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(props, ref) {
  const { children, portalled = true, portalRef, offset, ...rest } = props
  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraDrawerPositioner padding={offset}>
        <ChakraDrawerContent ref={ref} {...rest} asChild={false}>
          {children}
        </ChakraDrawerContent>
      </ChakraDrawerPositioner>
    </Portal>
  )
})

export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawerCloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="sm" ref={ref} />
    </ChakraDrawerCloseTrigger>
  )
})

export const DrawerTrigger = ChakraDrawer.Trigger as React.ForwardRefExoticComponent<HTMLChakraProps<"button"> & React.RefAttributes<HTMLButtonElement>>;
export const DrawerRoot = ChakraDrawer.Root
export const DrawerFooter = ChakraDrawer.Footer
export const DrawerHeader = ChakraDrawer.Header
export const DrawerBody = ChakraDrawer.Body
export const DrawerBackdrop = ChakraDrawer.Backdrop
export const DrawerDescription = ChakraDrawer.Description
export const DrawerTitle = ChakraDrawer.Title
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger
