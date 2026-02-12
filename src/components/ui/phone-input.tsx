import * as React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Country data with proper Unicode flag emojis
const countries = [
  { code: "+1", name: "United States", iso: "US", flag: "🇺🇸" },
  { code: "+1", name: "Canada", iso: "CA", flag: "🇨🇦" },
  { code: "+7", name: "Russia", iso: "RU", flag: "🇷🇺" },
  { code: "+20", name: "Egypt", iso: "EG", flag: "🇪🇬" },
  { code: "+27", name: "South Africa", iso: "ZA", flag: "🇿🇦" },
  { code: "+30", name: "Greece", iso: "GR", flag: "🇬🇷" },
  { code: "+31", name: "Netherlands", iso: "NL", flag: "🇳🇱" },
  { code: "+32", name: "Belgium", iso: "BE", flag: "🇧🇪" },
  { code: "+33", name: "France", iso: "FR", flag: "🇫🇷" },
  { code: "+34", name: "Spain", iso: "ES", flag: "🇪🇸" },
  { code: "+36", name: "Hungary", iso: "HU", flag: "🇭🇺" },
  { code: "+39", name: "Italy", iso: "IT", flag: "🇮🇹" },
  { code: "+40", name: "Romania", iso: "RO", flag: "🇷🇴" },
  { code: "+41", name: "Switzerland", iso: "CH", flag: "🇨🇭" },
  { code: "+43", name: "Austria", iso: "AT", flag: "🇦🇹" },
  { code: "+44", name: "United Kingdom", iso: "GB", flag: "🇬🇧" },
  { code: "+45", name: "Denmark", iso: "DK", flag: "🇩🇰" },
  { code: "+46", name: "Sweden", iso: "SE", flag: "🇸🇪" },
  { code: "+47", name: "Norway", iso: "NO", flag: "🇳🇴" },
  { code: "+48", name: "Poland", iso: "PL", flag: "🇵🇱" },
  { code: "+49", name: "Germany", iso: "DE", flag: "🇩🇪" },
  { code: "+51", name: "Peru", iso: "PE", flag: "🇵🇪" },
  { code: "+52", name: "Mexico", iso: "MX", flag: "🇲🇽" },
  { code: "+53", name: "Cuba", iso: "CU", flag: "🇨🇺" },
  { code: "+54", name: "Argentina", iso: "AR", flag: "🇦🇷" },
  { code: "+55", name: "Brazil", iso: "BR", flag: "🇧🇷" },
  { code: "+56", name: "Chile", iso: "CL", flag: "🇨🇱" },
  { code: "+57", name: "Colombia", iso: "CO", flag: "🇨🇴" },
  { code: "+58", name: "Venezuela", iso: "VE", flag: "🇻🇪" },
  { code: "+60", name: "Malaysia", iso: "MY", flag: "🇲🇾" },
  { code: "+61", name: "Australia", iso: "AU", flag: "🇦🇺" },
  { code: "+62", name: "Indonesia", iso: "ID", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", iso: "PH", flag: "🇵🇭" },
  { code: "+64", name: "New Zealand", iso: "NZ", flag: "🇳🇿" },
  { code: "+65", name: "Singapore", iso: "SG", flag: "🇸🇬" },
  { code: "+66", name: "Thailand", iso: "TH", flag: "🇹🇭" },
  { code: "+81", name: "Japan", iso: "JP", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", iso: "KR", flag: "🇰🇷" },
  { code: "+84", name: "Vietnam", iso: "VN", flag: "🇻🇳" },
  { code: "+86", name: "China", iso: "CN", flag: "🇨🇳" },
  { code: "+90", name: "Turkey", iso: "TR", flag: "🇹🇷" },
  { code: "+91", name: "India", iso: "IN", flag: "🇮🇳" },
  { code: "+92", name: "Pakistan", iso: "PK", flag: "🇵🇰" },
  { code: "+93", name: "Afghanistan", iso: "AF", flag: "🇦🇫" },
  { code: "+94", name: "Sri Lanka", iso: "LK", flag: "🇱🇰" },
  { code: "+95", name: "Myanmar", iso: "MM", flag: "🇲🇲" },
  { code: "+98", name: "Iran", iso: "IR", flag: "🇮🇷" },
  { code: "+212", name: "Morocco", iso: "MA", flag: "🇲🇦" },
  { code: "+213", name: "Algeria", iso: "DZ", flag: "🇩🇿" },
  { code: "+216", name: "Tunisia", iso: "TN", flag: "🇹🇳" },
  { code: "+218", name: "Libya", iso: "LY", flag: "🇱🇾" },
  { code: "+220", name: "Gambia", iso: "GM", flag: "🇬🇲" },
  { code: "+221", name: "Senegal", iso: "SN", flag: "🇸🇳" },
  { code: "+222", name: "Mauritania", iso: "MR", flag: "🇲🇷" },
  { code: "+223", name: "Mali", iso: "ML", flag: "🇲🇱" },
  { code: "+224", name: "Guinea", iso: "GN", flag: "🇬🇳" },
  { code: "+225", name: "Ivory Coast", iso: "CI", flag: "🇨🇮" },
  { code: "+226", name: "Burkina Faso", iso: "BF", flag: "🇧🇫" },
  { code: "+227", name: "Niger", iso: "NE", flag: "🇳🇪" },
  { code: "+228", name: "Togo", iso: "TG", flag: "🇹🇬" },
  { code: "+229", name: "Benin", iso: "BJ", flag: "🇧🇯" },
  { code: "+230", name: "Mauritius", iso: "MU", flag: "🇲🇺" },
  { code: "+231", name: "Liberia", iso: "LR", flag: "🇱🇷" },
  { code: "+232", name: "Sierra Leone", iso: "SL", flag: "🇸🇱" },
  { code: "+233", name: "Ghana", iso: "GH", flag: "🇬🇭" },
  { code: "+234", name: "Nigeria", iso: "NG", flag: "🇳🇬" },
  { code: "+235", name: "Chad", iso: "TD", flag: "🇹🇩" },
  { code: "+236", name: "Central African Republic", iso: "CF", flag: "🇨🇫" },
  { code: "+237", name: "Cameroon", iso: "CM", flag: "🇨🇲" },
  { code: "+238", name: "Cape Verde", iso: "CV", flag: "🇨🇻" },
  { code: "+239", name: "São Tomé and Príncipe", iso: "ST", flag: "🇸🇹" },
  { code: "+240", name: "Equatorial Guinea", iso: "GQ", flag: "🇬🇶" },
  { code: "+241", name: "Gabon", iso: "GA", flag: "🇬🇦" },
  { code: "+242", name: "Republic of the Congo", iso: "CG", flag: "🇨🇬" },
  { code: "+243", name: "Democratic Republic of the Congo", iso: "CD", flag: "🇨🇩" },
  { code: "+244", name: "Angola", iso: "AO", flag: "🇦🇴" },
  { code: "+245", name: "Guinea-Bissau", iso: "GW", flag: "🇬🇼" },
  { code: "+246", name: "British Indian Ocean Territory", iso: "IO", flag: "🇮🇴" },
  { code: "+248", name: "Seychelles", iso: "SC", flag: "🇸🇨" },
  { code: "+249", name: "Sudan", iso: "SD", flag: "🇸🇩" },
  { code: "+250", name: "Rwanda", iso: "RW", flag: "🇷🇼" },
  { code: "+251", name: "Ethiopia", iso: "ET", flag: "🇪🇹" },
  { code: "+252", name: "Somalia", iso: "SO", flag: "🇸🇴" },
  { code: "+253", name: "Djibouti", iso: "DJ", flag: "🇩🇯" },
  { code: "+254", name: "Kenya", iso: "KE", flag: "🇰🇪" },
  { code: "+255", name: "Tanzania", iso: "TZ", flag: "🇹🇿" },
  { code: "+256", name: "Uganda", iso: "UG", flag: "🇺🇬" },
  { code: "+257", name: "Burundi", iso: "BI", flag: "🇧🇮" },
  { code: "+258", name: "Mozambique", iso: "MZ", flag: "🇲🇿" },
  { code: "+260", name: "Zambia", iso: "ZM", flag: "🇿🇲" },
  { code: "+261", name: "Madagascar", iso: "MG", flag: "🇲🇬" },
  { code: "+262", name: "Réunion", iso: "RE", flag: "🇷🇪" },
  { code: "+263", name: "Zimbabwe", iso: "ZW", flag: "🇿🇼" },
  { code: "+264", name: "Namibia", iso: "NA", flag: "🇳🇦" },
  { code: "+265", name: "Malawi", iso: "MW", flag: "🇲🇼" },
  { code: "+266", name: "Lesotho", iso: "LS", flag: "🇱🇸" },
  { code: "+267", name: "Botswana", iso: "BW", flag: "🇧🇼" },
  { code: "+268", name: "Swaziland", iso: "SZ", flag: "🇸🇿" },
  { code: "+269", name: "Comoros", iso: "KM", flag: "🇰🇲" },
  { code: "+290", name: "Saint Helena", iso: "SH", flag: "🇸🇭" },
  { code: "+291", name: "Eritrea", iso: "ER", flag: "🇪🇷" },
  { code: "+297", name: "Aruba", iso: "AW", flag: "🇦🇼" },
  { code: "+298", name: "Faroe Islands", iso: "FO", flag: "🇫🇴" },
  { code: "+299", name: "Greenland", iso: "GL", flag: "🇬🇱" },
  { code: "+350", name: "Gibraltar", iso: "GI", flag: "🇬🇮" },
  { code: "+351", name: "Portugal", iso: "PT", flag: "🇵🇹" },
  { code: "+352", name: "Luxembourg", iso: "LU", flag: "🇱🇺" },
  { code: "+353", name: "Ireland", iso: "IE", flag: "🇮🇪" },
  { code: "+354", name: "Iceland", iso: "IS", flag: "🇮🇸" },
  { code: "+355", name: "Albania", iso: "AL", flag: "🇦🇱" },
  { code: "+356", name: "Malta", iso: "MT", flag: "🇲🇹" },
  { code: "+357", name: "Cyprus", iso: "CY", flag: "🇨🇾" },
  { code: "+358", name: "Finland", iso: "FI", flag: "🇫🇮" },
  { code: "+359", name: "Bulgaria", iso: "BG", flag: "🇧🇬" },
  { code: "+370", name: "Lithuania", iso: "LT", flag: "🇱🇹" },
  { code: "+371", name: "Latvia", iso: "LV", flag: "🇱🇻" },
  { code: "+372", name: "Estonia", iso: "EE", flag: "🇪🇪" },
  { code: "+373", name: "Moldova", iso: "MD", flag: "🇲🇩" },
  { code: "+374", name: "Armenia", iso: "AM", flag: "🇦🇲" },
  { code: "+375", name: "Belarus", iso: "BY", flag: "🇧🇾" },
  { code: "+376", name: "Andorra", iso: "AD", flag: "🇦🇩" },
  { code: "+377", name: "Monaco", iso: "MC", flag: "🇲🇨" },
  { code: "+378", name: "San Marino", iso: "SM", flag: "🇸🇲" },
  { code: "+380", name: "Ukraine", iso: "UA", flag: "🇺🇦" },
  { code: "+381", name: "Serbia", iso: "RS", flag: "🇷🇸" },
  { code: "+382", name: "Montenegro", iso: "ME", flag: "🇲🇪" },
  { code: "+383", name: "Kosovo", iso: "XK", flag: "🇽🇰" },
  { code: "+385", name: "Croatia", iso: "HR", flag: "🇭🇷" },
  { code: "+386", name: "Slovenia", iso: "SI", flag: "🇸🇮" },
  { code: "+387", name: "Bosnia and Herzegovina", iso: "BA", flag: "🇧🇦" },
  { code: "+389", name: "North Macedonia", iso: "MK", flag: "🇲🇰" },
  { code: "+420", name: "Czech Republic", iso: "CZ", flag: "🇨🇿" },
  { code: "+421", name: "Slovakia", iso: "SK", flag: "🇸🇰" },
  { code: "+423", name: "Liechtenstein", iso: "LI", flag: "🇱🇮" },
  { code: "+500", name: "Falkland Islands", iso: "FK", flag: "🇫🇰" },
  { code: "+501", name: "Belize", iso: "BZ", flag: "🇧🇿" },
  { code: "+502", name: "Guatemala", iso: "GT", flag: "🇬🇹" },
  { code: "+503", name: "El Salvador", iso: "SV", flag: "🇸🇻" },
  { code: "+504", name: "Honduras", iso: "HN", flag: "🇭🇳" },
  { code: "+505", name: "Nicaragua", iso: "NI", flag: "🇳🇮" },
  { code: "+506", name: "Costa Rica", iso: "CR", flag: "🇨🇷" },
  { code: "+507", name: "Panama", iso: "PA", flag: "🇵🇦" },
  { code: "+508", name: "Saint Pierre and Miquelon", iso: "PM", flag: "🇵🇲" },
  { code: "+509", name: "Haiti", iso: "HT", flag: "🇭🇹" },
  { code: "+590", name: "Guadeloupe", iso: "GP", flag: "🇬🇵" },
  { code: "+591", name: "Bolivia", iso: "BO", flag: "🇧🇴" },
  { code: "+592", name: "Guyana", iso: "GY", flag: "🇬🇾" },
  { code: "+593", name: "Ecuador", iso: "EC", flag: "🇪🇨" },
  { code: "+594", name: "French Guiana", iso: "GF", flag: "🇬🇫" },
  { code: "+595", name: "Paraguay", iso: "PY", flag: "🇵🇾" },
  { code: "+596", name: "Martinique", iso: "MQ", flag: "🇲🇶" },
  { code: "+597", name: "Suriname", iso: "SR", flag: "🇸🇷" },
  { code: "+598", name: "Uruguay", iso: "UY", flag: "🇺🇾" },
  { code: "+599", name: "Netherlands Antilles", iso: "AN", flag: "🇦🇳" },
  { code: "+670", name: "East Timor", iso: "TL", flag: "🇹🇱" },
  { code: "+672", name: "Antarctica", iso: "AQ", flag: "🇦🇶" },
  { code: "+673", name: "Brunei", iso: "BN", flag: "🇧🇳" },
  { code: "+674", name: "Nauru", iso: "NR", flag: "🇳🇷" },
  { code: "+675", name: "Papua New Guinea", iso: "PG", flag: "🇵🇬" },
  { code: "+676", name: "Tonga", iso: "TO", flag: "🇹🇴" },
  { code: "+677", name: "Solomon Islands", iso: "SB", flag: "🇸🇧" },
  { code: "+678", name: "Vanuatu", iso: "VU", flag: "🇻🇺" },
  { code: "+679", name: "Fiji", iso: "FJ", flag: "🇫🇯" },
  { code: "+680", name: "Palau", iso: "PW", flag: "🇵🇼" },
  { code: "+681", name: "Wallis and Futuna", iso: "WF", flag: "🇼🇫" },
  { code: "+682", name: "Cook Islands", iso: "CK", flag: "🇨🇰" },
  { code: "+683", name: "Niue", iso: "NU", flag: "🇳🇺" },
  { code: "+684", name: "American Samoa", iso: "AS", flag: "🇦🇸" },
  { code: "+685", name: "Samoa", iso: "WS", flag: "🇼🇸" },
  { code: "+686", name: "Kiribati", iso: "KI", flag: "🇰🇮" },
  { code: "+687", name: "New Caledonia", iso: "NC", flag: "🇳🇨" },
  { code: "+688", name: "Tuvalu", iso: "TV", flag: "🇹🇻" },
  { code: "+689", name: "French Polynesia", iso: "PF", flag: "🇵🇫" },
  { code: "+690", name: "Tokelau", iso: "TK", flag: "🇹🇰" },
  { code: "+691", name: "Micronesia", iso: "FM", flag: "🇫🇲" },
  { code: "+692", name: "Marshall Islands", iso: "MH", flag: "🇲🇭" },
  { code: "+850", name: "North Korea", iso: "KP", flag: "🇰🇵" },
  { code: "+852", name: "Hong Kong", iso: "HK", flag: "🇭🇰" },
  { code: "+853", name: "Macau", iso: "MO", flag: "🇲🇴" },
  { code: "+855", name: "Cambodia", iso: "KH", flag: "🇰🇭" },
  { code: "+856", name: "Laos", iso: "LA", flag: "🇱🇦" },
  { code: "+880", name: "Bangladesh", iso: "BD", flag: "🇧🇩" },
  { code: "+886", name: "Taiwan", iso: "TW", flag: "🇹🇼" },
  { code: "+960", name: "Maldives", iso: "MV", flag: "🇲🇻" },
  { code: "+961", name: "Lebanon", iso: "LB", flag: "🇱🇧" },
  { code: "+962", name: "Jordan", iso: "JO", flag: "🇯🇴" },
  { code: "+963", name: "Syria", iso: "SY", flag: "🇸🇾" },
  { code: "+964", name: "Iraq", iso: "IQ", flag: "🇮🇶" },
  { code: "+965", name: "Kuwait", iso: "KW", flag: "🇰🇼" },
  { code: "+966", name: "Saudi Arabia", iso: "SA", flag: "🇸🇦" },
  { code: "+967", name: "Yemen", iso: "YE", flag: "🇾🇪" },
  { code: "+968", name: "Oman", iso: "OM", flag: "🇴🇲" },
  { code: "+970", name: "Palestine", iso: "PS", flag: "🇵🇸" },
  { code: "+971", name: "United Arab Emirates", iso: "AE", flag: "🇦🇪" },
  { code: "+972", name: "Israel", iso: "IL", flag: "🇮🇱" },
  { code: "+973", name: "Bahrain", iso: "BH", flag: "🇧🇭" },
  { code: "+974", name: "Qatar", iso: "QA", flag: "🇶🇦" },
  { code: "+975", name: "Bhutan", iso: "BT", flag: "🇧🇹" },
  { code: "+976", name: "Mongolia", iso: "MN", flag: "🇲🇳" },
  { code: "+977", name: "Nepal", iso: "NP", flag: "🇳🇵" },
  { code: "+992", name: "Tajikistan", iso: "TJ", flag: "🇹🇯" },
  { code: "+993", name: "Turkmenistan", iso: "TM", flag: "🇹🇲" },
  { code: "+994", name: "Azerbaijan", iso: "AZ", flag: "🇦🇿" },
  { code: "+995", name: "Georgia", iso: "GE", flag: "🇬🇪" },
  { code: "+996", name: "Kyrgyzstan", iso: "KG", flag: "🇰🇬" },
  { code: "+998", name: "Uzbekistan", iso: "UZ", flag: "🇺🇿" },
];

export interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "size"> {
  value?: string
  onChange?: (value: string) => void
  size?: "default" | "lg"
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, size = "default", disabled, ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.iso === "ID") || countries[0])
    const [phoneNumber, setPhoneNumber] = useState("")

    // Extract phone number from value if it starts with country code
    React.useEffect(() => {
      if (value) {
        const country = countries.find(c => value.startsWith(c.code))
        if (country) {
          setSelectedCountry(country)
          setPhoneNumber(value.slice(country.code.length).trim())
        } else {
          setPhoneNumber(value)
        }
      }
    }, [value])

    const handleCountryChange = (countryIso: string) => {
      const country = countries.find(c => c.iso === countryIso)
      if (country) {
        setSelectedCountry(country)
        const fullValue = `${country.code} ${phoneNumber}`.trim()
        onChange?.(fullValue)
      }
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value
      setPhoneNumber(newPhoneNumber)
      const fullValue = `${selectedCountry.code} ${newPhoneNumber}`.trim()
      onChange?.(fullValue)
    }

    return (
      <div className="flex w-full">
        <Select
          value={selectedCountry.iso}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger 
            className={cn(
              "w-auto min-w-[140px] rounded-r-none border-r-0 bg-white/70 border-sand-dark/30 focus:border-ocean focus-visible:ring-ocean/20",
              size === "lg" && "h-14 text-lg"
            )}
            data-phone-input
          >
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-lg emoji-flag">
                  {selectedCountry.flag}
                </span>
                <span className="text-sm font-medium">{selectedCountry.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {countries.map((country) => (
              <SelectItem key={country.iso} value={country.iso}>
                <div className="flex items-center gap-3">
                  <span className="text-lg emoji-flag">
                    {country.flag}
                  </span>
                  <span className="text-sm">{country.code}</span>
                  <span className="text-sm text-gray-600">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          {...props}
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={disabled}
          className={cn(
            "rounded-l-none bg-white/70 border-sand-dark/30 focus:border-ocean focus-visible:ring-ocean/20 transition-all duration-300",
            size === "lg" && "h-14 text-lg",
            className
          )}
        />
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput" 