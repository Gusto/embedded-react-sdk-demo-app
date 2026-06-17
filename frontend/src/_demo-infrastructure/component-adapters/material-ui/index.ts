import type { ComponentsContextType } from "@gusto/embedded-react-sdk";
import { MuiAlert } from "./components/Alert";
import { MuiBadge } from "./components/Badge";
import { MuiBanner } from "./components/Banner";
import { MuiBox } from "./components/Box";
import { MuiBoxHeader } from "./components/BoxHeader";
import { MuiBreadcrumbs } from "./components/Breadcrumbs";
import { MuiButton } from "./components/Button";
import { MuiButtonIcon } from "./components/ButtonIcon";
import { MuiCalendarPreview } from "./components/CalendarPreview";
import { MuiCard } from "./components/Card";
import { MuiCheckbox } from "./components/Checkbox";
import { MuiCheckboxGroup } from "./components/CheckboxGroup";
import { MuiComboBox } from "./components/ComboBox";
import { MuiDatePicker } from "./components/DatePicker";
import { MuiDateRangePicker } from "./components/DateRangePicker";
import { MuiDescriptionList } from "./components/DescriptionList";
import { MuiDialog } from "./components/Dialog";
import { MuiFileInput } from "./components/FileInput";
import { MuiHeading } from "./components/Heading";
import { MuiLink } from "./components/Link";
import { MuiOrderedList, MuiUnorderedList } from "./components/List";
import { MuiLoadingSpinner } from "./components/LoadingSpinner";
import { MuiMenu } from "./components/Menu";
import { MuiModal } from "./components/Modal";
import { MuiMultiSelectComboBox } from "./components/MultiSelectComboBox";
import { MuiNumberInput } from "./components/NumberInput";
import { MuiPaginationControl } from "./components/PaginationControl";
import { MuiProgressBar } from "./components/ProgressBar";
import { MuiRadio } from "./components/Radio";
import { MuiRadioGroup } from "./components/RadioGroup";
import { MuiSelect } from "./components/Select";
import { MuiSwitch } from "./components/Switch";
import { MuiTable } from "./components/Table";
import { MuiTabs } from "./components/Tabs";
import { MuiText } from "./components/Text";
import { MuiTextArea } from "./components/TextArea";
import { MuiTextInput } from "./components/TextInput";

// Full Material UI implementation of the SDK's component contract. Typed as the
// complete ComponentsContextType so the compiler flags any missing primitive;
// PayrollLoading is intentionally omitted (the SDK provides a built-in default).
export const materialUiAdapter: ComponentsContextType = {
  Alert: MuiAlert,
  Badge: MuiBadge,
  Banner: MuiBanner,
  Box: MuiBox,
  BoxHeader: MuiBoxHeader,
  Breadcrumbs: MuiBreadcrumbs,
  Button: MuiButton,
  ButtonIcon: MuiButtonIcon,
  CalendarPreview: MuiCalendarPreview,
  Card: MuiCard,
  Checkbox: MuiCheckbox,
  CheckboxGroup: MuiCheckboxGroup,
  ComboBox: MuiComboBox,
  DatePicker: MuiDatePicker,
  DateRangePicker: MuiDateRangePicker,
  DescriptionList: MuiDescriptionList,
  Dialog: MuiDialog,
  FileInput: MuiFileInput,
  Heading: MuiHeading,
  Link: MuiLink,
  LoadingSpinner: MuiLoadingSpinner,
  Menu: MuiMenu,
  Modal: MuiModal,
  MultiSelectComboBox: MuiMultiSelectComboBox,
  NumberInput: MuiNumberInput,
  OrderedList: MuiOrderedList,
  PaginationControl: MuiPaginationControl,
  ProgressBar: MuiProgressBar,
  Radio: MuiRadio,
  RadioGroup: MuiRadioGroup,
  Select: MuiSelect,
  Switch: MuiSwitch,
  Table: MuiTable,
  Tabs: MuiTabs,
  Text: MuiText,
  TextArea: MuiTextArea,
  TextInput: MuiTextInput,
  UnorderedList: MuiUnorderedList,
};
