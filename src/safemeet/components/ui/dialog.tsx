import { Dialog as ChakraDialog, Portal, HTMLChakraProps } from "@chakra-ui/react";
import { CloseButton } from "./close-button";
import * as React from "react";

interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  backdrop?: boolean
}

const ChakraDialogContent = ChakraDialog.Content as React.ForwardRefExoticComponent<HTMLChakraProps<"section"> & React.RefAttributes<HTMLDivElement>>;
const ChakraDialogCloseTrigger = ChakraDialog.CloseTrigger as React.ForwardRefExoticComponent<HTMLChakraProps<"button"> & React.RefAttributes<HTMLButtonElement>>;

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(props, ref) {
  const {
    children,
    portalled = true,
    portalRef,
    backdrop = true,
    ...rest
  } = props

  return (
    <Portal disabled={!portalled} container={portalRef}>
      {backdrop && <ChakraDialog.Backdrop />}
      <ChakraDialog.Positioner>
        <ChakraDialogContent ref={ref} {...rest} asChild={false}>
          {children}
        </ChakraDialogContent>
      </ChakraDialog.Positioner>
    </Portal>
  )
})

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialogCloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="sm" ref={ref}>
        {props.children}
      </CloseButton>
    </ChakraDialogCloseTrigger>
  )
})

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;