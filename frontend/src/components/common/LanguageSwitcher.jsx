import { useLanguage } from "../../context/LanguageContext";
import CustomSelect from "./CustomSelect";

export default function LanguageSwitcher({
  className = "",
  onLanguageChange,
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <CustomSelect
      name="language"
      label={t("Toggle language")}
      labelClassName="sr-only"
      size="sm"
      className={className || "w-28"}
      value={language}
      onChange={(event) => {
        setLanguage(event.target.value);
        onLanguageChange?.(event.target.value);
      }}
      options={[
        { value: "en", label: t("English") },
        { value: "hi", label: t("Hindi") },
      ]}
      placeholder={t("Toggle language")}
    />
  );
}
