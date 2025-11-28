import { useEffect, useState } from "react";
import eventBus from "@/lib/eventBus";
import EnquiriesFormBottomSheet from "../modals/EnquiriesBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { ContentAccessModal } from "@/components/modals/ContentAccessModal";
import { AgentShareSheet } from "@/components/modals/agent/AgentShareSheet";
import { AppShareSheet } from "@/components/modals/AppShareSheet";

export default function AuthModals() {
  const [enquiry, setEnquiry] = useState<AuthModalProps | null>(null);
  const [staffs, setStaffs] = useState<AuthModalProps | null>(null);
  const [access, setAccess] = useState<AuthModalProps | null>(null);
  const [agent, setAgent] = useState<AuthModalProps | null>(null);
  const [app, setApp] = useState<AuthModalProps | null>(null);

  useEffect(() => {
    eventBus.addEventListener("openAccessModal", setAccess);
    eventBus.addEventListener("openEnquiryModal", setEnquiry);
    eventBus.addEventListener("openStaffs", setStaffs);
    eventBus.addEventListener("openAgentModal", setAgent);
    eventBus.addEventListener("openAppModal", setApp);
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
      {!!agent && (
        <AgentShareSheet
          {...agent}
          onDismiss={() => {
            agent.onDismiss?.();
            setAgent(null);
          }}
        />
      )}
      {!!app && (
        <AppShareSheet
          {...app}
          onDismiss={() => {
            app.onDismiss?.();
            setApp(null);
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
export function openAgentModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openAgentModal", props);
}
export function openAppModal(props: AuthModalProps) {
  eventBus.dispatchEvent("openAppModal", props);
}
