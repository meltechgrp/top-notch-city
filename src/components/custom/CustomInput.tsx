import { fetchDocumentTypes } from "@/actions/user";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import DatePicker from "@/components/custom/DatePicker";
import { AgentServicesModal } from "@/components/modals/profile/AgentServicesModal";
import {
  Company,
  CompanyModal,
} from "@/components/modals/profile/CompanyModal";
import { DocumentModal } from "@/components/modals/profile/DocumentModal";
import { LanguageModal } from "@/components/modals/profile/LanguageModal";
import { LocationModal } from "@/components/modals/profile/LocationModal";
import { SocialLinkModal } from "@/components/modals/profile/SocialLinksModal";
import { WorkingDayDialog } from "@/components/modals/profile/WorkingDayDialog";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import {
  Icon,
  Image,
  Pressable,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { DAYS, GENDERS, minimumAge, SOCIAL_PLATFORMS } from "@/constants/user";
import useGetLocation from "@/hooks/useGetLocation";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, isDate } from "date-fns";
import { router } from "expo-router";
import {
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  MapPin,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity } from "react-native";

interface Props extends Partial<TextInputProps> {
  multiline?: boolean;
  isLogin?: boolean;
  title?: string;
  inputType?: any;
  onUpdate: (val: string) => void;
  errorMesssage?: string;
  inputClassName?: string;
  returnKeyLabel?: string;
  height?: number;
  type?: any;
  containerClassName?: string;
  showModal?: boolean;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CustomInputProps {
  showModal?: boolean;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  value?: string;
  onUpdate: (updated: string) => void;
  disabled?: boolean;
}

function CustomInputComponent({
  value,
  onUpdate,
  title,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines = 20,
  isLogin = false,
  returnKeyType,
  className,
  returnKeyLabel,
  inputType,
  height,
  type = "text",
  inputClassName,
  containerClassName,
  showModal = false,
  setShowModal,
  ...props
}: Props) {
  const theme = useResolvedTheme();
  const [secure, setSecure] = useState(props.secureTextEntry || false);
  const multilineStyle = useMemo(
    () =>
      multiline
        ? {
            height: height || 120,
            textAlignVertical: "top" as const,
          }
        : {},
    [multiline, height]
  );

  const textColor = useMemo(() => ({ color: Colors[theme].text }), [theme]);
  function RenderInput() {
    switch (inputType) {
      case "gender":
        return <GenderInput value={value} onUpdate={onUpdate} />;
      case "companies":
        return (
          <CompaniesInput
            showModal={showModal}
            setShowModal={setShowModal}
            value={value}
            onUpdate={onUpdate}
          />
        );
      case "date_of_birth":
        return <DateInput value={value} onUpdate={onUpdate} />;
      case "documents":
        return <DocumentsInput value={value} onUpdate={onUpdate} />;
      case "date_of_birth":
        return <DateInput value={value} onUpdate={onUpdate} />;
      case "specialties":
        return (
          <AgentServiceInput
            showModal={showModal}
            setShowModal={setShowModal}
            value={value}
            onUpdate={onUpdate}
          />
        );
      case "address":
        return (
          <LocationInput
            showModal={showModal}
            setShowModal={setShowModal}
            value={value}
            onUpdate={onUpdate}
          />
        );
      case "languages":
        return (
          <LanguagesInput
            showModal={showModal}
            setShowModal={setShowModal}
            value={value}
            onUpdate={onUpdate}
          />
        );
      case "social_links":
        return <SocialLinksInput value={value} onUpdate={onUpdate} />;
      case "working_hours":
        return <WorkingHoursInput value={value} onUpdate={onUpdate} />;

      default:
        return <></>;
    }
  }
  return (
    <View
      className={cn(
        "py-px min-h-[5rem] gap-2 rounded-xl",
        !title && "min-h-[3.5rem]",
        containerClassName
      )}
    >
      {title && (
        <View className="px-2 flex-row items-center justify-between">
          <Text className=" text-typography text-sm">{title}</Text>
          {isLogin && (
            <Pressable
              onPress={() => {
                router.push("/(auth)/reset-password");
              }}
            >
              <Text className="text-sm text-primary">Forgotten Password?</Text>
            </Pressable>
          )}
        </View>
      )}
      <RenderInput />
      <View
        className={cn(
          "bg-background-muted ios:flex-1 flex-row justify-between items-center border border-outline-100 px-4 rounded-xl",
          multiline ? "min-h-40" : "h-[3.5rem]",
          inputType && "hidden",
          className
        )}
      >
        <TextInput
          {...props}
          placeholder={placeholder}
          autoCapitalize="sentences"
          className={cn(
            "text-typography placeholder:text-typography/80 focus:outline-none flex-1 h-full rounded-xl",
            multiline && "px-1 pt-2"
          )}
          value={value}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onChangeText={onUpdate}
          style={[multilineStyle, textColor]}
        />

        {props.secureTextEntry && (
          <Pressable
            className="py-2 pl-2"
            onPress={() => setSecure((p: boolean) => !p)}
          >
            {secure ? (
              <Icon size="sm" as={EyeOff} />
            ) : (
              <Icon size="sm" as={Eye} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

export const CustomInput = memo(CustomInputComponent);

export function GenderInput({ value, onUpdate }: CustomInputProps) {
  return (
    <View className="p-4 border border-outline rounded-2xl gap-3">
      {GENDERS.map((g) => {
        const active = value === g;
        return (
          <Pressable
            key={g}
            className="flex-row bg-background-muted items-center justify-between gap-3 p-4 rounded-xl"
            onPress={() => onUpdate(g)}
          >
            <Text className="capitalize text-base">{g}</Text>
            <View className="w-6 h-6 rounded-full border border-outline-100 items-center justify-center">
              {active && <View className="w-4 h-4 rounded-full bg-primary" />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
export function ButtonsInput({
  value,
  onUpdate,
  disabled,
  title,
  placeholder = "Add",
  label = "",
}: CustomInputProps & {
  placeholder?: string;
  label?: string;
  title?: string;
}) {
  const num = Number.isInteger(value) ? 0 : Number(value);
  return (
    <View className="gap-1">
      {title && (
        <Text className="text-sm text-typography/80 font-medium pl-2">
          {title}
        </Text>
      )}
      <View className="flex-row justify-between bg-background-muted rounded-xl border border-outline-100 px-4 py-2 items-center">
        {num ? (
          <Text className="font-medium">
            {num} <Text className="text-typography/80">{label}</Text>
          </Text>
        ) : (
          <Text className="text-typography/80 text-sm">{placeholder}</Text>
        )}
        <View className="flex-row items-center gap-6">
          <AnimatedPressable
            onPress={() => onUpdate(Math.max(0, num - 1).toString())}
          >
            <View className="p-2 border border-outline-100 bg-background rounded-full">
              <Icon as={Minus} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => onUpdate(Math.max(0, num + 1).toString())}
          >
            <View className="p-2 border border-outline-100 bg-background rounded-full">
              <Icon as={Plus} />
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

export function DateInput({
  value,
  onUpdate,
  modal = false,
  label,
  className,
  containerClassName,
  withMinDate = true,
}: CustomInputProps & {
  modal?: boolean;
  label?: string;
  className?: string;
  containerClassName?: string;
  withMinDate?: boolean;
}) {
  return (
    <View className={cn("items-center mb-8", containerClassName)}>
      <DatePicker
        label={label || "Date of Birth"}
        placeholder="Day/Month/Year"
        value={isDate(value) ? value : null}
        onChange={(val) => onUpdate(format(new Date(val), "yyyy-MM-dd"))}
        mode="date"
        modal={modal}
        className={className}
        maximumDate={withMinDate ? minimumAge : undefined}
        startDate={withMinDate ? minimumAge : undefined}
      />
    </View>
  );
}

type DayValue = string | undefined;

export function WorkingHoursInput({ value, onUpdate }: CustomInputProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [record, setRecord] = useState<Record<string, DayValue>>({});

  useEffect(() => {
    const base: Record<string, DayValue> = {};
    DAYS.forEach((d) => (base[d] = undefined));

    if (value) {
      try {
        const parsed = JSON.parse(value);
        DAYS.forEach((d) => {
          base[d] = parsed[d] ?? undefined;
        });
      } catch {}
    }

    setRecord(base);
  }, []);

  const handleSave = (day: string, val: string) => {
    const updated = { ...record, [day]: val || undefined };
    setRecord(updated);
    onUpdate(JSON.stringify(updated));
  };
  const openDialog = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <>
      <View className="gap-2">
        {DAYS.map((day) => {
          const val = record[day];
          return (
            <Pressable
              key={day}
              className="flex-row items-center justify-between py-3"
              onPress={() => openDialog(day)}
            >
              <View>
                <Text className="text-base font-medium capitalize ">{day}</Text>
                {val ? (
                  <Text className="text-sm text-gray-300">{val}</Text>
                ) : (
                  <Text className="text-sm text-primary">Closed</Text>
                )}
              </View>

              <ChevronRight size={18} color="#888" />
            </Pressable>
          );
        })}
      </View>
      <WorkingDayDialog
        visible={!!selectedDay}
        day={selectedDay || ""}
        initial={selectedDay ? record[selectedDay] : undefined}
        onClose={() => setSelectedDay(null)}
        onSave={handleSave}
      />
    </>
  );
}

type SocialLinks = Record<string, string | undefined>;

export function SocialLinksInput({ value, onUpdate }: CustomInputProps) {
  const [links, setLinks] = useState<SocialLinks>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  useEffect(() => {
    const base: SocialLinks = {};
    SOCIAL_PLATFORMS.forEach((p) => (base[p.name] = ""));

    if (value) {
      try {
        const parsed = JSON.parse(value);
        SOCIAL_PLATFORMS.forEach((p) => {
          base[p.name] = parsed[p.name] ?? "";
        });
      } catch {}
    }

    setLinks(base);
  }, []);

  const openModal = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const savePlatformLink = (link: string) => {
    if (!selectedPlatform) return;

    const updated = { ...links, [selectedPlatform]: link.trim() };
    setLinks(updated);
    onUpdate(JSON.stringify(updated));

    setSelectedPlatform(null);
  };

  return (
    <>
      <View className="gap-4">
        {SOCIAL_PLATFORMS.map(({ name, icon: Logo }) => {
          const val = links[name];

          return (
            <View key={name} className="flex-row items-center justify-between ">
              <View className="flex-row items-center gap-2">
                <Logo size={16} color="#fff" />
                <Text className="text-sm font-medium">{name}</Text>
              </View>

              <Pressable
                onPress={() => openModal(name)}
                className="p-2.5 rounded-xl bg-background-muted border border-outline-100"
              >
                {val ? (
                  <View className="flex-row gap-3 items-center">
                    <Text className="text-sm text-typography/80">{val}</Text>
                    <Icon as={Edit} size={"md"} color="#fff" />
                  </View>
                ) : (
                  <Icon as={Plus} size={"xl"} className="text-primary" />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>

      <SocialLinkModal
        visible={!!selectedPlatform}
        platform={selectedPlatform}
        value={links[selectedPlatform || ""] || ""}
        onClose={() => setSelectedPlatform(null)}
        onSave={savePlatformLink}
      />
    </>
  );
}
export function LanguagesInput({
  value,
  onUpdate,
  showModal,
  setShowModal,
}: CustomInputProps) {
  const [langs, setLangs] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      const raw = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      setLangs(raw);
    }
  }, []);

  const push = (arr: string[]) => onUpdate(arr.join(", "));

  const saveLang = (lang: string) => {
    const updated = [...langs, lang];
    setLangs(updated);
    push(updated);
  };

  const removeLang = (name: string) => {
    const updated = langs.filter((l) => l !== name);
    setLangs(updated);
    push(updated);
  };
  return (
    <>
      <View className="gap-3">
        {langs.length === 0 && (
          <View className="py-8 items-center">
            <Text className="text-typography/80 text-lg">
              No language added yet
            </Text>
          </View>
        )}

        {langs.map((l, i) => (
          <Pressable
            key={i}
            onPress={() => removeLang(l)}
            className="bg-background-muted p-4 rounded-xl flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text className="font-semibold">{l}</Text>
            </View>

            <Pressable>
              <Trash2 size={18} color="red" />
            </Pressable>
          </Pressable>
        ))}
      </View>

      <LanguageModal
        visible={showModal || false}
        value={""}
        onClose={() => setShowModal?.(false)}
        onSave={saveLang}
      />
    </>
  );
}

export function AgentServiceInput({
  value,
  onUpdate,
  showModal,
  setShowModal,
}: CustomInputProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      const raw = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      setSelected(raw);
    }
  }, []);

  const push = (arr: string[]) => onUpdate(arr.join(", "));

  const removeService = (name: string) => {
    const updated = selected.filter((s) => s !== name);
    setSelected(updated);
    push(updated);
  };

  const addService = (name: string) => {
    if (!selected.includes(name)) {
      const updated = [...selected, name];
      setSelected(updated);
      push(updated);
    }
  };

  return (
    <View className="gap-4">
      <View className="gap-3">
        {selected.map((s) => (
          <View
            key={s}
            className="flex-row items-center justify-between bg-background-muted px-4 py-3 rounded-xl"
          >
            <Text className=" text-base flex-1">{s}</Text>
            <TouchableOpacity onPress={() => removeService(s)}>
              <X size={20} color="#f55" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <AgentServicesModal
        open={showModal || false}
        onClose={() => setShowModal?.(false)}
        onSelect={addService}
        selected={selected}
      />
    </View>
  );
}
export function CompaniesInput({
  value,
  onUpdate,
  showModal,
  setShowModal,
}: CustomInputProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    if (!value) {
      setCompanies([]);
      return;
    }

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        setCompanies(parsed);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.log("Invalid companies value", err);
      setCompanies([]);
    }
  }, [value]);

  const addCompany = (company: Company) => {
    const updated = [...companies, company];
    setCompanies(updated);
    onUpdate(JSON.stringify(updated));
  };

  const removeCompany = (name: string) => {
    const updated = companies.filter((c) => c.name !== name);
    setCompanies(updated);
    onUpdate(JSON.stringify(updated));
  };

  return (
    <>
      <View className="gap-3">
        {companies.length === 0 && (
          <View className="py-8 items-center">
            <Text className="text-typography/80 text-lg">
              No company added yet
            </Text>
          </View>
        )}

        {companies.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => removeCompany(c.name)}
            className="bg-background-muted p-4 rounded-xl flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text className="font-semibold">{c.name}</Text>
              {!!c.address && (
                <Text className="text-gray-300">{c.address}</Text>
              )}
            </View>

            <Pressable>
              <Trash2 size={18} color="red" />
            </Pressable>
          </Pressable>
        ))}
      </View>

      <CompanyModal
        visible={showModal || false}
        onClose={() => setShowModal?.(false)}
        onSave={addCompany}
      />
    </>
  );
}
export function LocationInput({
  value,
  onUpdate,
  showModal,
  setShowModal,
}: CustomInputProps) {
  const { retryGetLocation } = useGetLocation();
  const [loading, setLoading] = useState(false);

  const address = useMemo<GooglePlace | null>(() => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }, [value]);

  const updateAddress = useCallback(
    (addr: GooglePlace | null) => {
      onUpdate(addr ? JSON.stringify(addr) : "");
    },
    [onUpdate]
  );

  const handleUseLocation = useCallback(async () => {
    setLoading(true);

    const location = await retryGetLocation();
    if (!location) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setLoading(false);
    }

    const result = await getReverseGeocode(location);

    if (!result?.address) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setLoading(false);
    }

    const payload: GooglePlace = {
      displayName: result.address,
      addressComponents: result.addressComponents!,
      location,
    };

    updateAddress(payload);
    setLoading(false);
  }, [retryGetLocation, updateAddress]);

  return (
    <View className="gap-4">
      <View className="gap-3">
        {address && (
          <View className="gap-4">
            {Object.entries(address.addressComponents)
              .filter(([_, b]) => !!b)
              .map(([key, val]) => (
                <View
                  key={key}
                  className="flex-row items-center justify-between bg-background-muted px-4 py-3 rounded-xl"
                >
                  <Text className="text-sm capitalize">{key}:</Text>
                  <Text className="text-lg text-typography">{val}</Text>
                </View>
              ))}
          </View>
        )}

        {!address && (
          <MiniEmptyState
            className="mt-8"
            description="location will be displayed here"
            subIcon={MapPin}
            loading={loading}
            buttonLabel="Current location"
            onPress={() => {
              handleUseLocation();
            }}
            title="Add location"
          />
        )}
      </View>

      <LocationModal
        open={showModal || false}
        handleUseLocation={handleUseLocation}
        onClose={() => setShowModal?.(false)}
        onSelect={(place) => updateAddress(place)}
      />
    </View>
  );
}

export function DocumentsInput({
  value,
  onUpdate,
  showModal,
  setShowModal,
}: CustomInputProps) {
  const [documents, setDocuments] = useState<AgentDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocumentTypes,
  });
  const documentData = data || [];

  useEffect(() => {
    if (!value) {
      setDocuments([]);
      return;
    }

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        setDocuments(parsed);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.log("Invalid documents value", err);
      setDocuments([]);
    }
  }, [value]);

  const addDocument = (d: AgentDocument) => {
    const updated = [...documents, d];
    setDocuments(updated);
    onUpdate(JSON.stringify(updated));
  };

  const removeDocument = (name: string) => {
    const updated = documents.filter((c) => c.document_types !== name);
    setDocuments(updated);
    onUpdate(JSON.stringify(updated));
  };
  return (
    <>
      <View className="gap-4">
        {documentData.map(({ name, id }) => {
          const file = documents.find((d) => d.document_types == name);
          return (
            <View key={id} className="flex-row items-center justify-between ">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm capitalize font-medium">{name}</Text>
              </View>

              <Pressable
                onPress={() => {
                  if (file) {
                    removeDocument(name);
                  }
                  setSelectedDoc(name);
                }}
                className="p-2.5 rounded-xl bg-background-muted border border-outline-100"
              >
                {file ? (
                  <View className="flex-row gap-3 items-center">
                    <Text>Uploaded</Text>
                    <Icon as={Trash2} size={"md"} color="#fff" />
                  </View>
                ) : (
                  <View className="flex-row gap-3 items-center">
                    <Text className="text-sm">Upload</Text>
                    <Icon as={Plus} size={"md"} color="#fff" />
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
      <DocumentModal
        visible={!!selectedDoc}
        onClose={() => setSelectedDoc?.(null)}
        onSave={addDocument}
        selected={selectedDoc || ""}
      />
    </>
  );
}
