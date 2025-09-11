import { useEffect, useState } from "react";
import eventBus from "@/lib/eventBus";
import EnquiriesFormBottomSheet from "../modals/EnquiriesBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { ContentAccessModal } from "@/components/modals/ContentAccessModal";

export default function AuthModals() {
  const [enquiry, setEnquiry] = useState<AuthModalProps | null>(null);
  const [staffs, setStaffs] = useState<AuthModalProps | null>(null);
  const [access, setAccess] = useState<AuthModalProps | null>(null);

  useEffect(() => {
    eventBus.addEventListener("openAccessModal", setAccess);
    eventBus.addEventListener("openEnquiryModal", setEnquiry);
    eventBus.addEventListener("openStaffs", setStaffs);
  }, []);

  return (
    <>
      {!!enquiry && (
        <EnquiriesFormBottomSheet
          {...enquiry}
          onDismiss={() => {
            enquiry.onDismiss?.();
            setEnquiry(null);
          }}
        />
      )}
      {!!staffs && (
        <CustomerCareBottomSheet
          {...staffs}
          onDismiss={() => {
            staffs.onDismiss?.();
            setEnquiry(null);
          }}
        />
      )}
      {!!access && (
        <ContentAccessModal
          {...access}
          onDismiss={() => {
            access.onDismiss?.();
            setAccess(null);
          }}
        />
      )}
    </>
  );
}

export function openEnquiryModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openEnquiryModal", props);
}
export function openStaffsModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openStaffs", props);
}
export function openAccessModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openAccessModal", props);
}
