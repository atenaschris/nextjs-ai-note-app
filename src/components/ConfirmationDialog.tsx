
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import LoadingButton from "./ui/loading-button";

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  deleteInProgress:boolean
}

export default function ConfirmationDialog({
  open,
  setOpen,
  onConfirm,
  deleteInProgress
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {"Are you sure you want to delete the current Note?"}
          </DialogTitle>
        </DialogHeader>
        <LoadingButton
          variant={'ghost'}
          type="button"
          loading={deleteInProgress}
          onClick={onConfirm}
        >
          Confirm
        </LoadingButton>
        <LoadingButton
          type="button"
          loading={false}
          onClick={() => setOpen(false)}
        >
          Dismiss
        </LoadingButton>
      </DialogContent>
    </Dialog>
  );
}
