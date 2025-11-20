import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import withRenderVisible from "@/components/shared/withRenderOpen";

type Props = {
  role: Me["role"];
  visible: boolean;
  onDismiss: () => void;
  handleRole: (role: Me["role"]) => void;
};

function UserRolesBottomSheet(props: Props) {
  const { visible, onDismiss, role, handleRole } = props;
  const Roles = [
    {
      label: "User",
      value: "user",
    },
    {
      label: "Agent",
      value: "agent",
    },
    {
      label: "Staff",
      value: "staff",
    },
    {
      label: "Staff Agent",
      value: "staff_agent",
    },
    {
      label: "Admin",
      value: "admin",
    },
  ];
  return (
    <OptionsBottomSheet
      isOpen={visible}
      onDismiss={onDismiss}
      onChange={async (val) => handleRole(val.value)}
      value={
        Roles?.find((r) => r.value == role) || {
          label: "User",
          value: "user",
        }
      }
      options={Roles}
    />
  );
}

export default withRenderVisible(UserRolesBottomSheet);
