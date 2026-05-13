import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MiradorMenuButton } from "mirador";
import PropTypes from "prop-types";

const CopyToClipboard = ({ onCopy, supported, t }) => {
  if (!supported) {
    return null;
  }
  return (
    <InputAdornment position="end">
      <MiradorMenuButton
        aria-label={t("canvasLink.copyToClipboard")}
        edge="end"
        onClick={onCopy}
      >
        <ContentCopyIcon fontSize="small" />
      </MiradorMenuButton>
    </InputAdornment>
  );
};

CopyToClipboard.propTypes = {
  onCopy: PropTypes.func.isRequired,
  supported: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default CopyToClipboard;
