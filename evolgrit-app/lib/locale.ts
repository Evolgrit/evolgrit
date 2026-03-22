export function getLocaleForLanguage(code?: string) {
  switch ((code ?? "").toLowerCase()) {
    case "de":
      return "de-DE";
    case "fr":
      return "fr-FR";
    case "nl":
      return "nl-NL";
    case "en":
      return "en-US";
    case "sv":
      return "sv-SE";
    case "no":
      return "nb-NO";
    case "da":
      return "da-DK";
    case "fi":
      return "fi-FI";
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    case "tr":
      return "tr-TR";
    case "pl":
      return "pl-PL";
    case "uk":
      return "uk-UA";
    case "ro":
      return "ro-RO";
    case "vi":
      return "vi-VN";
    case "ur":
      return "ur-PK";
    case "bn":
      return "bn-BD";
    case "hi":
      return "hi-IN";
    case "ar":
      return "ar-SA";
    case "id":
      return "id-ID";
    case "ms":
      return "ms-MY";
    case "fil":
      return "fil-PH";
    default:
      return "de-DE";
  }
}
