import { Box } from "@mui/material";
import CookieConsent from "react-cookie-consent";
import { COOKIE_CONSENT_COOKIE } from "../../common/constants";

const CookieConsentHOC: React.FC<{
  children: any;
}> = ({ children }) => {
  return (
    <Box>
      {!document.cookie.includes(COOKIE_CONSENT_COOKIE) && (
        <CookieConsent
          location="bottom"
          buttonText="I accept"
          cookieName={COOKIE_CONSENT_COOKIE}
          style={{
            background: "#2B373B",
            fontFamily: "JetBrains Mono, monospace",
          }}
          buttonStyle={{
            color: "#4e503b",
            fontSize: "13px",
            fontFamily: "JetBrains Mono, monospace",
          }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      )}
      {children}
    </Box>
  );
};

export default CookieConsentHOC;
